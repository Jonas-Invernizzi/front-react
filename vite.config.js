import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler: memoiza componentes automaticamente no build.
    // (No Vite 8 o plugin-react não usa mais Babel; por isso o compilador
    // entra pelo @rolldown/plugin-babel.)
    babel({ presets: [reactCompilerPreset()] }),
  ],
  optimizeDeps: {
    include: ['axios'],
  },
  server: {
    port: 5173,
    // Durante o desenvolvimento, toda requisição para /api é repassada ao
    // Laravel. Assim o navegador fala só com o Vite e não há CORS.
    proxy: {
      '/api': {
        // Porta que o container do Laravel expõe no seu computador
        // (lado esquerdo do "ports:" no docker-compose.yml; no Sail, APP_PORT).
        target: 'http://localhost:8081',
        changeOrigin: true,
        // Se as rotas estiverem em routes/web.php (sem o prefixo /api),
        // descomente a linha abaixo para tirar o /api antes de repassar:
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
