import React, { useEffect, useRef } from 'react';
import EyeImage from './assets/tiger_eye.png';
import './tigerEyes.css';

const TigerEyes = () => {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const centerEyeRef = useRef(null);

  const eyeCenters = useRef([]);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const maxMove = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const eyes = [leftEyeRef.current, rightEyeRef.current, centerEyeRef.current];

    const updateEyeCentersAndMaxMove = () => {
      eyeCenters.current = [
        { x: window.innerWidth * 0.45, y: window.innerHeight * 0.45 },
        { x: window.innerWidth * 0.55, y: window.innerHeight * 0.45 },
        { x: window.innerWidth * 0.50, y: window.innerHeight * 0.55 },
      ];
      // Set max movement to be a % of window size
      maxMove.current.x = window.innerWidth * 0.005;  // 2% of window width
      maxMove.current.y = window.innerHeight * 0.01; // 2% of window height
    };

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const animate = () => {
      eyes.forEach((eye, idx) => {
        const center = eyeCenters.current[idx];
        const dx = (mousePos.current.x - center.x) / window.innerWidth;
        const dy = (mousePos.current.y - center.y) / window.innerHeight;
        const moveX = clamp(dx * maxMove.current.x * 2, -maxMove.current.x, maxMove.current.x);
        const moveY = clamp(dy * maxMove.current.y * 2, -maxMove.current.y, maxMove.current.y);
        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateEyeCentersAndMaxMove);

    updateEyeCentersAndMaxMove(); // Initial setup
    animate(); // start animation loop

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateEyeCentersAndMaxMove);
    };
  }, []);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  return (
    <>
      <img ref={leftEyeRef} src={EyeImage} alt="Eye" className="eye eye-left" />
      <img ref={rightEyeRef} src={EyeImage} alt="Eye" className="eye eye-right" />
      <img ref={centerEyeRef} src={EyeImage} alt="Eye" className="eye eye-center" />
    </>
  );
};

export default TigerEyes;
