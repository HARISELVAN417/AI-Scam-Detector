import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // Depth Fog
    scene.fog = new THREE.FogExp2('#050510', 0.08);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Sphere configuration
    const spheresCount = 70;
    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    
    const colors = ['#00f2ff', '#7000ff', '#0062ff', '#bd00ff'];

    // Create spheres
    for (let i = 0; i < spheresCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        roughness: 0,
        metalness: 1,
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, material);
      
      // Random initial positions in a wide space
      sphere.position.x = (Math.random() - 0.5) * 30;
      sphere.position.y = (Math.random() - 0.5) * 30;
      sphere.position.z = (Math.random() - 0.5) * 20;
      
      // Random properties for animation
      sphere.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002,
        originalScale: Math.random() * 2 + 0.5
      };
      
      sphere.scale.setScalar(sphere.userData.originalScale);
      
      scene.add(sphere);
      spheres.push(sphere);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 12;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = (time) => {
      requestAnimationFrame(animate);

      // Smooth parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      spheres.forEach((sphere) => {
        const { velocity, phase, speed, originalScale } = sphere.userData;
        
        // Random motion
        sphere.position.add(velocity);
        
        // Floating drift
        sphere.position.y += Math.sin(time * 0.001 + phase) * 0.005;
        sphere.position.x += Math.cos(time * 0.001 + phase) * 0.005;
        
        // Pulse scale
        const pulse = 1 + Math.sin(time * speed + phase) * 0.3;
        sphere.scale.setScalar(originalScale * pulse);

        // Parallax effect
        sphere.position.x += mouseX * 0.02;
        sphere.position.y -= mouseY * 0.02;

        // Boundary wrap-around
        if (sphere.position.x > 20) sphere.position.x = -20;
        if (sphere.position.x < -20) sphere.position.x = 20;
        if (sphere.position.y > 20) sphere.position.y = -20;
        if (sphere.position.y < -20) sphere.position.y = 20;
        if (sphere.position.z > 10) sphere.position.z = -10;
        if (sphere.position.z < -10) sphere.position.z = 10;
      });

      // Rotate scene slightly for extra depth
      scene.rotation.y = mouseX * 0.1;
      scene.rotation.x = -mouseY * 0.1;

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050510]">
      {/* Blue/Purple Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a2e] to-[#1a0533] opacity-80" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] animate-pulse delay-1000" />
      </div>

      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default Background3D;
