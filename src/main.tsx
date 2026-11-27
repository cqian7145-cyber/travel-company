import MatchaTheme from './MatchaTheme';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './styles-core.css';
import './styles-editorial.css';
import './styles-cities.css';
import './matcha.css';

createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
  <MatchaTheme>
   <App/>
  </MatchaTheme>
 </React.StrictMode>
);
