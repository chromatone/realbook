import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { viteSingleFile } from "vite-plugin-singlefile"
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  base: './',
  server: {
    port: 5411,
    strictPort: false,
  },
  preview: {
    host: "0.0.0.0",
    port: '8522'
  },
  plugins: [
    vue(),
    UnoCSS(),
    viteSingleFile(),
    viteBuildScript(),
    ViteYaml(),
  ],
})


function viteBuildScript() {
  return {
    name: 'vite-build-script',
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === 'production') {
        return html.replace(/<!-- Stats production build insert -->/, `<script defer src="https://stats.chromatone.center/script.js" data-website-id="3f4313ef-7306-436b-85c8-6d3b2d77d39e"></script>
          
          <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope: ', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed: ', error);
          });
      });
    }
  </script>`);
      }
      return html;
    },
  };
}