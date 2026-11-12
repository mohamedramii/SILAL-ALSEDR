import { createRoot } from 'react-dom/client';
import { setMotionDefault, applyMotionClass } from '@shared/motion.jsx';
import { LangProvider } from '@shared/i18n.jsx';
import '@fontsource/el-messiri/500.css';
import '@fontsource/el-messiri/600.css';
import '@fontsource/el-messiri/700.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@shared/tokens.css';
import './styles.css';
import App from './App.jsx';

// Design 1 "The Graft": full motion on every device by default; the visitor can still choose Reduce.
// (Components read the motion level lazily, at render time, so this runs before any of them asks.)
setMotionDefault('full');
applyMotionClass();

createRoot(document.getElementById('root')).render(
  <LangProvider>
    <App />
  </LangProvider>
);
