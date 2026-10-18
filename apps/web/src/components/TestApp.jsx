import React from 'react';

export default function TestApp() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0fdf4',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        fontSize: '48px',
        color: '#166534',
        padding: '40px',
        textAlign: 'center',
        fontWeight: 'bold',
        border: '2px solid #166534',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        ✅ TEST APP WORKS
        <div style={{ fontSize: '18px', marginTop: '16px', color: '#15803d', fontWeight: 'normal' }}>
          React is rendering correctly.
        </div>
      </div>
    </div>
  );
}