import { defineConfig } from '@umijs/max'
import proxy from './proxy'
import routes from './routes'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  clientLoader: {}, // 路由数据加载（数据预加载方案）
  initialState: {},
  request: {},
  layout: {},
  routes,
  npmClient: 'npm',
  proxy,
})
