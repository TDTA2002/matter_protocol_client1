import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  /* Config Alias */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@components": `${path.resolve(__dirname, "./src/components/")}`,
      "@pages": `${path.resolve(__dirname, "./src/pages/")}`,
      "@services": `${path.resolve(__dirname, "./src/services/")}`,
      "@routes": `${path.resolve(__dirname, "./src/routes/")}`,
      "@util": `${path.resolve(__dirname, "./src/util/")}`,
      "@slices": `${path.resolve(__dirname, "./src/stores/slices/")}`,
      "@admin": `${path.resolve(__dirname, "./src/admin")}`

    },
  },

  /* Config Global Scss Variable */
  // css: {
  //   preprocessorOptions: {
  //     scss: { additionalData: `@import "src/assets/scss/index.scss";` },
  //   }
  // }
})