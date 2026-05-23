import React from 'react';
import ReactDOM from 'react-dom/client';

// Test CSS injection
const style = document.createElement('style');
style.textContent = `
  body { margin: 0; padding: 0; }
  #root { width: 100vw; height: 100vh; }
  * { box-sizing: border-box; }
`;
document.head.appendChild(style);

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#0a0a0f', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      flexDirection: 'column'
    }}>
      <h1>Test Page</h1>
      <p>Siap untuk coba click di 3D scene</p>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
        Buka console (F12) untuk lihat log clicks
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);