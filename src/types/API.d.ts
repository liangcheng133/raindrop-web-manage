declare namespace API {
  /** 响应信息 */
  type Response<T> = {
    status: number
    msg: string
    data: T
    errMsg?: string
  }
  /** 通用字段 */
  type BasicField = {
    remark?: string
    create_user_id?: string
    create_user_name?: string
    update_user_id?: string
    update_user_name?: string
    create_time?: string
    update_time?: string
  }
  /** 系统用户 */
  type SysUserVO = BasicField & {
    id?: string
    account?: string
    name?: string
    avatar_url?: string
    mobile_phone?: string
    email?: string
    role_ids?: string
    role_names?: string
    org_id?: string
    org_name?: string
    status?: integer
  }
  /** 系统组织 */
  type SysOrgVO = BasicField & {
    id?: string
    name?: string
    parent_id?: string
    order?: integer
  }
  /** 系统角色 */
  type SysRoleVO = BasicField & {
    id?: string
    name?: string
    parent_id?: string
    order?: integer
  }
  /** 系统菜单 */
  type SysMenuVO = BasicField & {
    id?: string
    name?: string
    number?: string
    type?: number
    parent_id?: string
  }
  /** 登录 */
  type LoginVO = {
    token?: string
    user_id?: string
  }
}
