import { createRoot } from 'react-dom/client';
import '@fontsource/aref-ruqaa/700.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@shared/tokens.css';
import './v2.css';
import { LangProvider } from '@shared/i18n.jsx';
import { setMotionDefault, applyMotionClass } from '@shared/motion.jsx';
import App from './App.jsx';

// Full motion on every device by default; the visitor can still choose Reduce (header, menu and footer).
setMotionDefault('full');
applyMotionClass();

createRoot(document.getElementById('root')).render(
  <LangProvider>
    <App />
  </LangProvider>
);
