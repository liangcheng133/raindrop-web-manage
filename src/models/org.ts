import { querySysOrgListAllApi } from '@/services/org'
import { listToTree } from '@/utils'
import { useRequest } from '@umijs/max'
import { useSafeState } from 'ahooks'

export type OrgTreeItem = API.SysOrgVO & {
  children?: OrgTreeItem[]
}

export default () => {
  /** 组织树 */
  const [treeList, setTreeList] = useSafeState<OrgTreeItem[]>([])

  /** 包含顶部的组织树 */
  const [hasTopOrgTreeList, setHasTopTreeList] = useSafeState<OrgTreeItem[]>([])

  const {
    data: orgList,
    loading: refreshOrgLoading,
    run: refreshOrgList
  } = useRequest<API.Response<API.SysOrgVO[]>>(
    async () => {
      try {
        const res = await querySysOrgListAllApi()
        return res.data || []
      } catch (error) {
        return []
      }
    },
    {
      onSuccess: (data) => {
        const treeList = listToTree(data)
        setHasTopTreeList([{ name: '顶级', id: '0', children: treeList }])
        setTreeList(treeList)
      }
    }
  )

  return {
    orgList,
    treeList,
    hasTopOrgTreeList,
    refreshOrgLoading,
    refreshOrgList
  }
}
