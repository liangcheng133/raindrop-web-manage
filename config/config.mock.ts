import { defineConfig } from 'umi'

const BASE_MOCK_API = 'http://localhost:8055'

export default defineConfig({
  proxy: {
    '/api': {
      target: BASE_MOCK_API,
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
})
