import React from 'react';

export default function MinimalTest() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#FEF3C7', 
      color: '#78350F',
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>HELLO WORLD</h1>
      <p style={{ fontSize: '24px' }}>Minimal React Test Component</p>
      <div style={{ marginTop: '20px', padding: '10px', background: 'white', borderRadius: '4px' }}>
        Status: Rendering Correctly
      </div>
    </div>
  );
}