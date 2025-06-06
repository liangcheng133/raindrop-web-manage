/*
 * @Date: 2025-04-01 16:40:20
 * @LastEditTime: 2025-05-24 10:19:57
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 用户、权限信息
 */
import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import { LoginVOType } from '@/types/api'
import { InitialStateType } from '@/types/type'
import { antdUtil } from '@/utils/antdUtil'
import { localGet, localSet } from '@/utils/localStorage'
import { history, useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'

export default () => {
  const initialStateModel = useModel('@@initialState')
  const initialState = initialStateModel.initialState as InitialStateType

  const [token, setToken] = useSafeState<string>(localGet(USER_TOKEN_KEY) || '')
  const [userId, setUserId] = useSafeState<string>(localGet(USER_ID_KEY) || '')

  /** 登录成功后回调 */
  const handleLoginSuccess = async (res: LoginVOType) => {
    try {
      const { token, user_id } = res
      localSet(USER_TOKEN_KEY, token)
      localSet(USER_ID_KEY, user_id)
      setToken(token || '')
      setUserId(user_id || '')
      antdUtil.message?.success('登录成功')
      initialStateModel.refresh() // 更新初始化值，会请求更新用户信息和权限信息
      history.push('/')
    } catch (error) {
      console.log('[ 登录回调错误 ] >', error)
    }
  }

  return {
    handleLoginSuccess,
    token,
    userId,
    userInfo: initialState?.user_info || {}
  }
}
