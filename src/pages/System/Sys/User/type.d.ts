/** 组织树 */

export type OrgUpdateOrderType = {
  id?: string
  parent_id?: string
  sort?: number
}
export interface OrgTreeProps extends React.PropsWithChildren {
  /** 选中树节点回调 */
  onSelect?: (node?: OrgTreeItem) => void
}

/** 编辑用户弹框 */

export type EditUserModalProps = {
  /** 组织id，不传递时默认顶级组织 */
  orgId?: string
  /** 接口成功时回调 */
  onSuccess?: () => void
  /** 接口失败时回调 */
  onFail?: (error: any) => void
}
export type EditUserModalRef = {
  open: (data?: API.SysUserVO) => void
}
export type SysUserForm = Omit<API.SysUserVO, 'role_ids'> & {
  role_ids?: string[]
}

/** 编辑组织弹框 */

export type EditOrgModalProps = {
  /** 组织id，不传递时默认顶级组织 */
  orgId?: string
  /** 接口成功时回调 */
  onSuccess?: () => void
  /** 接口失败时回调 */
  onFail?: (error: any) => void
}
export type EditOrgModalRef = {
  /**
   * 打开弹框
   * @param {*} data 编辑数据，传递时则为编辑模式
   */
  open: (data?: API.SysOrgVO) => void
  /** 关闭弹框 */
  close: () => void
}
