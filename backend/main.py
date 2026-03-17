from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from tavily import TavilyClient
from supabase import create_client
import os
import json

load_dotenv()

# ── clients ──────────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini = genai.GenerativeModel("gemini-2.5-flash")
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# ── app ───────────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── request model ─────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str

# ── health check ──────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "gemini_key_set": bool(os.getenv("GEMINI_API_KEY")),
        "tavily_key_set": bool(os.getenv("TAVILY_API_KEY")),
        "supabase_url_set": bool(os.getenv("SUPABASE_URL")),
    }

# ── phase 2: extract claims via gemini ────────────────────
def extract_claims(text: str) -> dict:
    prompt = f"""
You are a financial fact-checking assistant.
Analyze the following financial news text and extract structured information.

Return ONLY valid JSON with this exact shape, no prose, no markdown:
{{
  "entities": {{
    "companies": [],
    "tickers": [],
    "periods": [],
    "amounts": []
  }},
  "claims": [],
  "search_queries": []
}}

Rules:
- claims: list of individual checkable factual statements from the text
- search_queries: exactly 5 targeted search strings to verify those claims
- entities: key financial entities mentioned

News text:
{text}
"""
    response = gemini.generate_content(prompt)
    raw = response.text.strip()

    # strip markdown code fences if gemini adds them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)

# ── phase 3: search evidence via tavily ───────────────────
def search_evidence(queries: list[str]) -> list[dict]:
    evidence = []
    for query in queries[:5]:
        try:
            result = tavily.search(query=query, max_results=3)
            for r in result.get("results", []):
                evidence.append({
                    "query": query,
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "content": r.get("content", "")[:500]
                })
        except Exception:
            continue
    return evidence

# ── phase 5: generate verdict via gemini ──────────────────
def generate_verdict(text: str, claims: list, evidence: list) -> dict:
    evidence_text = "\n\n".join([
        f"Source: {e['url']}\nTitle: {e['title']}\nSnippet: {e['content']}"
        for e in evidence
    ])

    prompt = f"""
You are a financial fact-checking assistant.
Given the original news text, extracted claims, and evidence snippets,
produce a verification verdict.

Return ONLY valid JSON with this exact shape, no prose, no markdown:
{{
  "verdict": "REAL" | "FAKE" | "UNVERIFIED",
  "confidence": <integer 0-100>,
  "summary": "<one sentence>",
  "claim_results": [
    {{
      "claim": "<claim text>",
      "result": "SUPPORTED" | "REFUTED" | "UNVERIFIED",
      "source": "<url or empty string>",
      "explanation": "<one sentence>"
    }}
  ]
}}

Rules:
- If confidence is below 70, force verdict to "UNVERIFIED"
- Be strict — financial misinformation is dangerous

Original text:
{text}

Extracted claims:
{json.dumps(claims, indent=2)}

Evidence:
{evidence_text}
"""
    response = gemini.generate_content(prompt)
    raw = response.text.strip()

    # strip markdown code fences if gemini adds them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)

    # enforce confidence rule
    if result.get("confidence", 0) < 70:
        result["verdict"] = "UNVERIFIED"

    return result

# ── main endpoint ─────────────────────────────────────────
@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.text or len(req.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text too short to analyze")

    try:
        # phase 2
        extracted = extract_claims(req.text)
        claims = extracted.get("claims", [])
        queries = extracted.get("search_queries", [])

        # phase 3
        evidence = search_evidence(queries)

        # phase 5
        verdict_data = generate_verdict(req.text, claims, evidence)

        # save to supabase
        supabase.table("analyses").insert({
            "input_text": req.text,
            "claims": claims,
            "evidence": evidence,
            "verdict": verdict_data.get("verdict"),
            "confidence": verdict_data.get("confidence"),
            "summary": verdict_data.get("summary"),
            "claim_results": verdict_data.get("claim_results"),
        }).execute()

        return verdict_data

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Gemini returned invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))