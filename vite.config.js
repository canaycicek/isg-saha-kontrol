import { defineConfig } from 'vite';

export default defineConfig({
    base: '/isg-saha-kontrol/',
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    server: {
        port: 5500
    }
});
