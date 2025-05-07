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

  const orgListRequest = useRef<Promise<any> | undefined>() // 存储当前请求
  const [orgTreeList, setOrgTreeList] = useSafeState<OrgTreeItem[]>([])

  const queryOrgListAll = async () => {
    const request = querySysOrgListAllAPI()
    orgListRequest.current = request
    const res = await request
    return res.data
  }

  const orgListRequestHook: Result<API.SysOrgVO[], any[]> = useRequest(queryOrgListAll, {
    ready: !isEmpty(token),
    manual: true,
    onSuccess: (data) => {
      if (!data) return
      orgListRequest.current = undefined
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
      setOrgTreeList(treeList)
    }
  })

  /**
   * 数据为空时，刷新组织列表
   * @param {Boolean} isReload 是否强制刷新
   */
  const refreshOrgList = (isReload = false) => {
    if (orgListRequest.current) {
      return orgListRequest.current
    }
    if (!isEmpty(token) && (isEmpty(orgListRequestHook.data) || isReload)) {
      return orgListRequestHook.runAsync()
    }
  }

  return {
    /** 组织列表 */
    orgList: orgListRequestHook.data,
    /** 组织树 */
    orgTreeList,
    /** 设置组织树 */
    setOrgTreeList,
    /** 组织列表接口loading */
    refreshOrgLoading: orgListRequestHook.loading,
    refreshOrgList
  }
}
