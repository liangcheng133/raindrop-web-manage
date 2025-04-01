/** 递归比较获取路由信息 */
function recursiveQueryRoute(routes: { [key: string]: any }[], callback: (route: any) => boolean) {
  let route = null
  for (const item of routes) {
    if (callback(item)) {
      route = item
    } else if (item.routes) {
      route = recursiveQueryRoute(item.routes, callback)
    }
    if (route) {
      break
    }
  }
  return route
}

export default function ({ routes }: { routes: any[] }) {
  console.log('[ patchClientRoutes routes ] >', routes)
  const route = recursiveQueryRoute(routes, (route) => route.indexNum === 0)
  console.log('[ 获取到的route ] >', route)
}
