// 全局共享数据
import { useRequest } from 'ahooks'

export default () => {
  const {
    data: authObj,
    loading: getUserAuthLoading,
    run: getUserAuth
  } = useRequest(
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            manage: {
              member: {
                index: true,
                view: true
              },
              system: {
                index: true
              }
            }
          })
        }, 5000)
      })
    },
    {
      manual: true // 手动触发请求
    }
  )

  return {
    authObj,
    getUserAuth,
    getUserAuthLoading
  }
}
