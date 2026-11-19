import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://ashfanansari.github.io/aurelia/
export default defineConfig({
  base: '/aurelia/',
  plugins: [react()],
});
