/*
 * @Date: 2025-04-07 16:55:00
 * @LastEditTime: 2025-05-14 10:00:38
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 系统角色数据
 */
import { querySysRoleListAllAPI } from '@/services/role'
import { useModel } from '@umijs/max'
import { useRequest } from 'ahooks'
import { Result } from 'ahooks/lib/useRequest/src/types'
import { isEmpty } from 'es-toolkit/compat'
import { useRef } from 'react'

export default () => {
  const requestRef = useRef<Promise<any> | undefined>() // 存储当前请求

  const queryRoleListAll = async () => {
    const request = querySysRoleListAllAPI()
    requestRef.current = request
    const res = await request
    return res.data || []
  }

  const requestHook: Result<API.SysRoleVO[], any[]> = useRequest(queryRoleListAll, {
    manual: true,
    onFinally: () => {
      requestRef.current = undefined
    }
  })

  /**
   * 数据为空时，刷新列表
   * @param {Boolean} isReload 是否强制刷新
   */
  const refresh = (isReload = false) => {
    if (requestRef.current) {
      return requestRef.current
    }
    if (isEmpty(requestHook.data) || isReload) {
      return requestHook.runAsync()
    }
  }

  return {
    /** 角色列表 */
    list: requestHook.data || [],
    /** 设置角色数据 */
    mutate: requestHook.mutate,
    /** 角色列表接口loading */
    loading: requestHook.loading,
    refresh
  }
}
