import MatchaTheme from './MatchaTheme';
import React from 'react';
import {createRoot} from 'react-dom/client';
import CulturePage from './CulturePage';
import './styles-core.css';
import './styles-editorial.css';
import './matcha.css';

createRoot(document.getElementById('culture-root')!).render(
 <React.StrictMode>
  <MatchaTheme>
   <CulturePage/>
  </MatchaTheme>
 </React.StrictMode>
);
