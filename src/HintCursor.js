import React, { useState, useEffect } from 'react';
import mouse from './assets/cursor.gif';
function HintCursor() {
  const [inactive, setInactive] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastInteraction(Date.now());
      setInactive(false); // user just interacted
    };

    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastInteraction > 10000) { // 10 seconds
        setInactive(true);
      }
    }, 1000); // check every second

    return () => {
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [lastInteraction]);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>

      {inactive && (
        <img
          src={mouse}
          alt="Hint Cursr"
          style={{
            position: 'fixed',
            top: '80%',
            left: '-150%',
            transform: 'translate(-50%, -50%) rotate(20deg)',
            width: '100%',
            pointerEvents: 'none',
            opacity: 1,
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}

export default HintCursor;
