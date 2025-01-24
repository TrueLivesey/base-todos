import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import sassGlobImports from 'vite-plugin-sass-glob-import';
// import { handlebarUpdate } from './src/js/functions';

export default defineConfig({
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 85,
      },
      jpeg: {
        quality: 85,
      },
      jpg: {
        quality: 85,
      },
    }),
    sassGlobImports(),
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/assets/partials'),
      reloadOnPartialChange: true,
      reload: true,
      refresh: true,
    }),
    {
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.html')) {
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (name) => {
          // Проверяем тип файла
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name].[hash][extname]'; // Все остальные файлы
        },
      },
    },
  },
});
