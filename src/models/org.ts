import { querySysOrgListAllApi } from '@/services/org'
import { listToTree } from '@/utils'
import { useRequest } from '@umijs/max'
import { useSafeState } from 'ahooks'

export type OrgTreeItem = API.SysOrgVO & {
  children?: OrgTreeItem[]
}

export default () => {
  const [orgTreeList, setOrgTreeList] = useSafeState<OrgTreeItem[]>([])

  const {
    data: orgList,
    loading: refreshOrgLoading,
    run: refreshOrgList
  } = useRequest<API.Response<API.SysOrgVO[]>>(querySysOrgListAllApi, {
    onSuccess: (data) => {
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

  return {
    /** 组织列表 */
    orgList,
    /** 组织树 */
    orgTreeList,
    /** 设置组织树 */
    setOrgTreeList,
    /** 组织列表接口loading */
    refreshOrgLoading,
    /** 刷新组织列表 */
    refreshOrgList
  }
}
