/*
 * @Date: 2025-04-07 16:55:00
 * @LastEditTime: 2025-05-08 11:01:25
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 系统组织数据
 */
import { querySysOrgListAllAPI } from '@/services/org'
import { listToTree } from '@/utils'
import { useModel } from '@umijs/max'
import { useRequest, useSafeState } from 'ahooks'
import { Result } from 'ahooks/lib/useRequest/src/types'
import { isEmpty } from 'es-toolkit/compat'
import { useRef } from 'react'

export type OrgTreeItem = API.SysOrgVO & {
  children?: OrgTreeItem[]
}

export default () => {
  const { token } = useModel('user')

  const requestRef = useRef<Promise<any> | undefined>() // 存储当前请求
  const [treeList, setTreeList] = useSafeState<OrgTreeItem[]>([])

  const queryOrgListAll = async () => {
    const request = querySysOrgListAllAPI()
    requestRef.current = request
    const res = await request
    return res.data || []
  }

  const requestHook: Result<API.SysOrgVO[], any[]> = useRequest(queryOrgListAll, {
    ready: !isEmpty(token),
    manual: true,
    onSuccess: (data) => {
      requestRef.current = undefined
      if (!data) return
      /** 排序 */
      const sortFn = (list: OrgTreeItem[]): OrgTreeItem[] => {
        return list
          .map((item) => {
            const newItem: OrgTreeItem = { ...item }
            if (item.children?.length) {
              newItem.children = sortFn(item.children)
            }
            return newItem
          })
          .sort((a, b) => {
            return a.order! - b.order!
          })
      }
      const treeList = sortFn(listToTree(data))
      setTreeList(treeList)
    }
  })

  /**
   * 数据为空时，刷新组织列表
   * @param {Boolean} isReload 是否强制刷新
   */
  const refresh = (isReload = false) => {
    if (requestRef.current) {
      return requestRef.current
    }
    if (!isEmpty(token) && (isEmpty(requestHook.data) || isReload)) {
      return requestHook.runAsync()
    }
  }

  return {
    /** 组织列表 */
    list: requestHook.data,
    /** 组织树 */
    treeList,
    /** 设置组织树 */
    setTreeList,
    /** 组织列表接口loading */
    loading: requestHook.loading,
    refresh
  }
}
