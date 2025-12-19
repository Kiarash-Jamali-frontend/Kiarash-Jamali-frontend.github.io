import { registerSW } from 'virtual:pwa-register'
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'katex/dist/katex.min.css'
import { Toaster } from 'react-hot-toast';

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <>
  <App />
    <Toaster position="top-center" />
  </>
);
