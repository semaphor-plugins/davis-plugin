import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import externalGlobals from 'rollup-plugin-external-globals';
import fs from 'fs';
import type { OutputBundle, OutputChunk } from 'rollup';

import { config } from './src/components/components.config';

function generateManifest() {
  // Convert the config object directly to JSON
  const jsonOutput = JSON.stringify(config, null, 2);

  // Write manifest.json directly to dist after build
  const distDir = path.resolve(__dirname, 'dist');
  fs.writeFileSync(path.join(distDir, 'manifest.json'), jsonOutput, 'utf8');

  console.log('manifest.json file created successfully.');
}

// Custom plugin to inject CSS as a string
function injectCSSPlugin() {
  return {
    name: 'inject-css',
    writeBundle(_options: unknown, bundle: OutputBundle) {
      // Check if CSS file exists in dist
      const cssPath = path.resolve(__dirname, 'dist/style.css');
      if (fs.existsSync(cssPath)) {
        // Read the CSS content
        const cssContent = fs.readFileSync(cssPath, 'utf8');

        // Create CSS injection code
        const cssInjectionCode = `
// Injected CSS
const style = document.createElement('style');
style.textContent = ${JSON.stringify(cssContent)};
document.head.appendChild(style);
`;

        // Find the main JS file in the bundle
        const mainFile = Object.values(bundle).find(
          (file): file is OutputChunk =>
            file.type === 'chunk' && file.fileName === 'index.js'
        );

        if (mainFile) {
          // Read the current JS file content
          const jsPath = path.resolve(__dirname, 'dist/index.js');
          const jsContent = fs.readFileSync(jsPath, 'utf8');

          // Prepend CSS injection code
          const newContent = cssInjectionCode + '\n' + jsContent;

          // Write back to file
          fs.writeFileSync(jsPath, newContent, 'utf8');

          // Remove the CSS file
          fs.unlinkSync(cssPath);
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  define:
    mode === 'production'
      ? { 'process.env.NODE_ENV': JSON.stringify('production') }
      : {},

  plugins: [
    react(),
    injectCSSPlugin(),
    {
      name: 'generate-manifest',
      writeBundle() {
        generateManifest(); // Runs after build completion
      },
    },
    mode === 'production' &&
      externalGlobals({
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'React',
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react/jsx-runtime': path.resolve(
        __dirname,
        'node_modules/react/jsx-runtime.js'
      ),
    },
  },

  build: {
    // sourcemap: true,
    cssCodeSplit: false, // Inline CSS into the JavaScript bundle
    cssMinify: true, // Minify CSS
    lib: {
      entry: {
        main: path.resolve(__dirname, 'src/components/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        if (entryName === 'main') {
          return format === 'es' ? 'index.js' : 'index.cjs';
        }
        return format === 'es'
          ? `${entryName}/index.js`
          : `${entryName}/index.cjs`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named', // Use named exports for easier access
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
        },
      },
    },
  },
}));
