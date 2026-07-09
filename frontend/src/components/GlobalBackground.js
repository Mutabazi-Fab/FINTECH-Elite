import React from 'react';

export default function GlobalBackground() {
  return (
    <div className="global-bg-container">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="global-bg-video"
      >
        <source src="/Scroll.mp4" type="video/mp4" />
      </video>
      <div className="global-bg-overlay"></div>
    </div>
  );
}
