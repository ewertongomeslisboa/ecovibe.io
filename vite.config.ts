import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Substitua 'nome-do-repositorio' pelo nome exato do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/ewertongomeslisboa/ecovibe.io',
})
