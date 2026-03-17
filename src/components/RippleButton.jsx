import React, { useState } from 'react';

const RippleButton = ({ onClick = () => {}, children, className = '', disabled = false, id = '' }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (disabled) return;

    // Ensure we have a valid event and target
    const button = event.currentTarget;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Handle cases where clientX/clientY might be missing (e.g. keyboard events)
    // Default to center of button if coordinates are missing
    const clientX = event.clientX !== undefined ? event.clientX : (rect.left + rect.width / 2);
    const clientY = event.clientY !== undefined ? event.clientY : (rect.top + rect.height / 2);

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now() + Math.random(), // More unique ID
    };

    setRipples((prev) => [...prev, newRipple]);
    
    // Call onClick if it exists
    if (onClick) {
      // Some event handlers might expect the event, so we pass it
      // but we wrap it to be safe
      try {
        onClick(event);
      } catch (err) {
        console.error("Error in RippleButton onClick:", err);
      }
    }

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      id={id}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full animate-ripple pointer-events-none blur-md shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;
