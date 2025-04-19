import { querySysOrgListAllApi } from '@/services/org'
import { listToTree } from '@/utils'
import { useModel, useRequest } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { isEmpty } from 'es-toolkit/compat'

export type OrgTreeItem = API.SysOrgVO & {
  children?: OrgTreeItem[]
}

export default () => {
  const { token } = useModel('user')
  const [orgTreeList, setOrgTreeList] = useSafeState<OrgTreeItem[]>([])

  const {
    data: orgList,
    loading: refreshOrgLoading,
    run
  } = useRequest<API.Response<API.SysOrgVO[]>>(
    () => {
      if (isEmpty(token)) {
        return Promise.resolve(null)
      }
      return querySysOrgListAllApi()
    },
    {
      onSuccess: (data) => {
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
        setOrgTreeList(treeList)
      }
    }
  )

  /**
   * 刷新组织列表
   * @param {Boolean} isReload 是否强制刷新
   */
  const refreshOrgList = (isReload = false) => {
    if (!isEmpty(token) && (isEmpty(orgList) || isReload)) {
      run()
    }
  }

  return {
    /** 组织列表 */
    orgList,
    /** 组织树 */
    orgTreeList,
    /** 设置组织树 */
    setOrgTreeList,
    /** 组织列表接口loading */
    refreshOrgLoading,
    refreshOrgList
  }
}
