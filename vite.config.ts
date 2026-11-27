import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {readFileSync} from 'node:fs';

// Keep the CLI-generated theme module intact; serve its licensed fonts locally.
const matchaFonts = {
 name:'china-closer-matcha-fonts',
 enforce:'pre' as const,
 load(id:string) {
  if(id.replaceAll('\\','/').split('?')[0].endsWith('/@astryxdesign/theme-matcha/fonts.css')) {
   return readFileSync(new URL('./public/fonts/astryx-matcha/fonts.css',import.meta.url),'utf8');
  }
 },
};
export default defineConfig({plugins:[matchaFonts,react()],server:{host:'127.0.0.1'},build:{outDir:'dist',chunkSizeWarningLimit:700,rollupOptions:{input:{main:'index.html',culture:'culture.html'}}}});
