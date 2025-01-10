import { defineConfig } from 'umi'

const BASE_API = 'http://localhost:8088'

export default defineConfig({
  proxy: {
    '/api': {
      target: BASE_API,
      changeOrigin: true,
      pathRewrite: { '^/': '' }
    }
  }
})
