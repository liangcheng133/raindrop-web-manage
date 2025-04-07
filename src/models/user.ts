import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import { sysUserAccountLoginApi } from '@/services/user'
import { localSet } from '@/utils/localStorage'
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

  /** 获取权限 */
  const getAuth = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('获取到权限数据')
        resolve({})
      }, 1000)
    })
  }

  /** 用户账号登录 */
  const userAccountLogin = async (params: any) => {
    const res = await sysUserAccountLoginApi(params)
    if (res.status !== 0) return
    localSet(USER_TOKEN_KEY, res.data.token)
    localSet(USER_ID_KEY, res.data.user_id)

    await getAuth()
    history.push('/')
  }

  return {
    userAccountLogin
  }
}
