import React, { useEffect, useRef } from 'react';
import EyeImage from './assets/tiger_eye.png';
import './tigerEyes.css';

const TreeEyes = () => {
  const eye1 = useRef(null);
  const eye2 = useRef(null);
  const eye3 = useRef(null);
  const eye4 = useRef(null);
  const eye5 = useRef(null);
  const eye6 = useRef(null);  
  const eye7 = useRef(null);
  const eye8 = useRef(null);
  const eye9 = useRef(null);
  const eye10 = useRef(null);
  const eye11 = useRef(null);
  const eye12 = useRef(null);
  const containerRef = useRef(null);
  

  const eyeCenters = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const maxMove = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const eyes = [
      eye1.current, eye2.current, eye3.current, eye4.current,
      eye5.current, eye6.current, eye7.current, eye8.current,
      eye9.current, eye10.current, eye11.current, eye12.current
    ].filter(eye => eye !== null); // Filter out any null refs

    const container = containerRef.current;

    const updateEyeCentersAndMaxMove = () => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      
      // Get each eye's absolute position
      eyeCenters.current = eyes.map(eye => {
        const eyeRect = eye.getBoundingClientRect();
        return {
          x: eyeRect.left + (eyeRect.width / 2),
          y: eyeRect.top + (eyeRect.height / 2)
        };
      });
      
      // Set max movement relative to container size
      maxMove.current.x = rect.width * 0.006;  // 0.6% of container width
      maxMove.current.y = rect.height * 0.006; // 0.6% of container height
    };

    const handleMouseMove = (e) => {
      // Use absolute mouse coordinates
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const animate = () => {
      if (!container) return;
      
      eyes.forEach((eye, idx) => {
        if (!eye) return;
        const center = eyeCenters.current[idx];
        
        // Calculate vector from eye center to mouse using absolute coordinates
        const dx = mousePos.current.x - center.x;
        const dy = mousePos.current.y - center.y;
        
        // Calculate angle to mouse
        const angle = Math.atan2(dy, dx);
        
        // Calculate distance to mouse
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate how far the eye should move (limited by maxMove)
        const moveDistance = Math.min(distance * 0.1, maxMove.current.x);
        
        // Calculate new position based on angle and distance
        const moveX = Math.cos(angle) * moveDistance;
        const moveY = Math.sin(angle) * moveDistance;
        
        // Apply the movement
        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      requestAnimationFrame(animate);
    };

    // Initial setup
    updateEyeCentersAndMaxMove();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateEyeCentersAndMaxMove);
    
    // Start animation
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateEyeCentersAndMaxMove);
    };
  }, []);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  return (
    <div ref={containerRef} className="tree-eyes-container">
      <img ref={eye1} src={EyeImage} alt="Eye" className="eye eye-1" />
      <img ref={eye2} src={EyeImage} alt="Eye" className="eye eye-2" />
      <img ref={eye3} src={EyeImage} alt="Eye" className="eye eye-3" />
      <img ref={eye4} src={EyeImage} alt="Eye" className="eye eye-4" />
      <img ref={eye5} src={EyeImage} alt="Eye" className="eye eye-5" />
      <img ref={eye6} src={EyeImage} alt="Eye" className="eye eye-6" />
      <img ref={eye7} src={EyeImage} alt="Eye" className="eye eye-7" />
      <img ref={eye8} src={EyeImage} alt="Eye" className="eye eye-8" />
      <img ref={eye9} src={EyeImage} alt="Eye" className="eye eye-9" />
      <img ref={eye10} src={EyeImage} alt="Eye" className="eye eye-10" />
      <img ref={eye11} src={EyeImage} alt="Eye" className="eye eye-11" />
      <img ref={eye12} src={EyeImage} alt="Eye" className="eye eye-12" />
    </div>
  );
};

export default TreeEyes; 