/*
 * @Date: 2025-04-01 16:40:20
 * @LastEditTime: 2025-05-09 10:04:10
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 用户、权限信息
 */
import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import { sysUserAccountLoginAPI, sysUserQueryByIdAPI } from '@/services/user'
import { antdUtil } from '@/utils/antdUtil'
import { localGet, localSet } from '@/utils/localStorage'
import { history } from '@umijs/max'
import { useRequest, useSafeState } from 'ahooks'
import { Result } from 'ahooks/lib/useRequest/src/types'
import { useEffect } from 'react'

const queryUserInfoById = async (id: string) => {
  const res = await sysUserQueryByIdAPI(id)
  return res.data
}

export default () => {
  const [token, setToken] = useSafeState<string>(localGet(USER_TOKEN_KEY) || '')
  const [userId, setUserId] = useSafeState<string>(localGet(USER_ID_KEY) || '')

  const sysUserInfoRequestHook: Result<API.SysUserVO, any[]> = useRequest(queryUserInfoById, {
    defaultParams: [userId],
    manual: true
  })

  useEffect(() => {
    if (userId) {
      getUserInfoAndAuth(userId)
    }
  }, [])

  /** 获取用户信息以及权限 */
  const getUserInfoAndAuth = (userId: string) => {
    return new Promise((resolve) => {
      const fetch = async () => {
        await sysUserInfoRequestHook.runAsync(userId)
        console.log('获取到用户数据')
        resolve({})
      }
      fetch()
    })
  }

  /** 登录成功后回调 */
  const loginSuccessAfter = async (res: API.LoginVO) => {
    try {
      const { token, user_id } = res
      localSet(USER_TOKEN_KEY, token)
      localSet(USER_ID_KEY, user_id)
      setToken(token!)
      setUserId(user_id!)
      antdUtil.message?.success('登录成功')
      await getUserInfoAndAuth(user_id!)
      history.push('/')
    } catch (error) {
      console.log('[ 登录回调错误 ] >', error)
    }
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
    userInfo: sysUserInfoRequestHook.data || {}
  }
}
