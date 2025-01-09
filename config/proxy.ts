/** 接口地址 */
const BASE_API = 'http://localhost:8088/api'

export default {
  '/api': {
    target: BASE_API,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }
}
