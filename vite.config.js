import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/globals.scss',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    // server: {
    //     cors: {
    //         origin: ['https://smkfilo.com.tr/', 'http://localhost:5173'],
    //         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //         credentials: true
    //     }
    // }
});
