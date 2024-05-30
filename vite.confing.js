import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three'],
                }
            }
        }
    }
})