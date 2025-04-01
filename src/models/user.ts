import { sysUserAccountLoginApi } from '@/services/user'
import { history, useRequest } from '@umijs/max'

export default () => {
  const {} = useRequest(() => {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'clx',
          account: 'admin'
        })
      }, 1000)
    })
  })

  const getAuth = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('获取到权限数据')
        resolve({})
      }, 1000)
    })
  }

  const userLogin = async (params: any) => {
   await sysUserAccountLoginApi(params)

    console.log('登录成功')
    await getAuth()
    console.log('准备跳转')
    history.push('/')
  }

  return {
    userLogin
  }
}
