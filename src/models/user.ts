/*
 * @Date: 2025-04-01 16:40:20
 * @LastEditTime: 2025-05-23 18:01:43
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 用户、权限信息
 */
import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import { getLoginUserAPI } from '@/services/user'
import { LoginVOType } from '@/types/API'
import { antdUtil } from '@/utils/antdUtil'
import { localGet, localSet } from '@/utils/localStorage'
import { history, useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { useRef } from 'react'

export default () => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState')

  const requestRef = useRef<Promise<any> | undefined>() // 存储当前请求
  const [token, setToken] = useSafeState<string>(localGet(USER_TOKEN_KEY) || '')
  const [userId, setUserId] = useSafeState<string>(localGet(USER_ID_KEY) || '')

  const getLoginUser = async () => {
    const request = getLoginUserAPI()
    requestRef.current = request
    const res = await request
    return res.data || []
  }

  /** 登录成功后回调 */
  const handleLoginSuccess = async (res: LoginVOType) => {
    try {
      const { token, user_id } = res
      localSet(USER_TOKEN_KEY, token)
      localSet(USER_ID_KEY, user_id)
      setToken(token || '')
      setUserId(user_id || '')
      antdUtil.message?.success('登录成功')
      refresh()
      history.push('/')
    } catch (error) {
      console.log('[ 登录回调错误 ] >', error)
    }
  }

  return {
    handleLoginSuccess,
    token,
    userId,
    userInfo: initialState?.userInfo || {}
  }
}
