import React, { useState } from 'react';

const RippleButton = ({ onClick = () => {}, children, className = '', disabled = false, id = '' }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (disabled) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
    
    if (onClick) onClick(event);

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
