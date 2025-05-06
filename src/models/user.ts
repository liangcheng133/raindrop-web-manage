import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import { sysUserAccountLoginAPI } from '@/services/user'
import { antdUtil } from '@/utils/antdUtil'
import { localGet, localSet } from '@/utils/localStorage'
import { history, useRequest } from '@umijs/max'
import { useSafeState } from 'ahooks'

export default () => {
  const [token, setToken] = useSafeState<string>(localGet(USER_TOKEN_KEY) || '')
  const [userId, setUserId] = useSafeState<string>(localGet(USER_ID_KEY) || '')
  const [userInfo, setUserInfo] = useSafeState({})

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

  /** 登录成功后回调 */
  const loginSuccessAfter = async (res: API.LoginVO) => {
    localSet(USER_TOKEN_KEY, res.token)
    localSet(USER_ID_KEY, res.user_id)
    setToken(res.token || "")
    setUserId(res.user_id || "")
    antdUtil.message?.success('登录成功')
    await getAuth()
    history.push('/')
  }

  /** 用户账号登录 */
  const userAccountLogin = async (params: any) => {
    try {
      const res = await sysUserAccountLoginAPI(params)
      loginSuccessAfter(res.data)
    } catch (error) {
      console.log('登录失败', error)
    }
  }

  return {
    userAccountLogin,
    token,
    userId,
    userInfo
  }
}
