import { defineConfig } from 'vite';

export default defineConfig({
    base: '/isg-saha-kontrol/',
    build: {
        outDir: 'dist',
        port: 5500
    }
});
