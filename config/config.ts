import { defineConfig } from '@umijs/max'
import routes from './routes'

export default defineConfig({
  define: {
    'process.env': process.env
  },
  antd: {},
  access: {},
  model: {},
  clientLoader: {}, // 路由数据加载（数据预加载方案）
  initialState: {},
  request: {},
  layout: {},
  routes,
  npmClient: 'npm'
})

console.log(`----当前的环境是：${process.env.UMI_ENV}----`)
