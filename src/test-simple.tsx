import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div style={{
      color: 'white',
      background: '#0a0a0f',
      padding: 40,
      fontFamily: 'monospace',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#00ffff' }}>Test Simple App</h1>
      <p>1. Open <code style={{ background: '#333', padding: '2px 6px' }}>http://localhost:3001/test-dummy.html</code> to verify React rendering.</p>
      <p>2. If that works but main app doesn't, the issue is likely in App.tsx or Scene/Board components.</p>
      <p>3. Check browser console for errors.</p>
      <p>4. If you see "App initializing..." but nothing renders, the issue is likely in the component tree.</p>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}