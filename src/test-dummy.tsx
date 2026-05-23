import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div style={{ color: 'white', background: 'black', padding: 20 }}>
      <h1>Test Dummy App</h1>
      <p>If you see this, React is working!</p>
      <p>Click this page to verify interactivity.</p>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}