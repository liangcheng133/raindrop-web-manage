/** 基础字段 */
export interface BasicField {
  remark?: string
  create_user_id?: string
  create_user_name?: string
  update_user_id?: string
  update_user_name?: string
  create_time?: string
  update_time?: string
}

/** 接口基础结构 */
export interface ResponseVO<T> {
  status: number
  msg: string
  data: T
  errMsg?: string
}

/** 账号登录 */
export interface AccountLoginDTO {
  account: string
  password: string
}

/** 系统用户类型 */
export interface SysUserVO extends BasicField {
  id: string
  account: string
  name: string
  avatar_url?: string
  mobile_phone: string
  email: string
  role_ids?: string
  role_names?: string
  org_id: string
  org_name: string
  status: number
  is_admin: number
}

/** 保存用户信息类型 */
export interface SysUserSaveDTO {
  id?: string
  account: string
  password?: string
  name: string
  avatar_url?: string
  mobile_phone: string
  email: string
  role_ids?: string
  org_id: string
  status: number
}

/** 保存用户角色类型 */
export interface SysUserUpdateRoleDTO {
  id: string
  role_ids: string
}

/** 保存用户组织类型 */
export interface SysUserUpdateOrgDTO {
  id: string
  org_id: string
}

/** 系统组织类型 */
export interface SysOrgVO extends BasicField {
  id: string
  name: string
  parent_id: string
  order?: number
}

/** 系统角色类型 */
export interface SysRoleVO extends BasicField {
  id: string
  name: string
  parent_id: string
  order?: number
}

/** 系统菜单类型 */
export interface SysMenuVO extends BasicField {
  id: string
  name: string
  number: string
  type: number
  parent_id: string
  auth: number
}

/** 登录返回信息类型 */
export interface AccountLoginVO {
  token: string
  user_id: string
}

/** 角色菜单权限类型 */
export interface SysRoleMenuSaveDTO {
  role_id: string
  menu_ids: string
}

/** 权限信息类型 */
export interface AuthMap extends Record<string, boolean | AuthMap> {}

/** 登录用户信息类型 */
export interface SysLoginUserVO {
  user_info: SysUserVO
  auths: AuthMap
}

/** 系统组织树类型 */
export interface SysOrgTreeVO extends SysOrgVO {
  children?: SysOrgVO[]
}

/** 轨迹信息类型 */
export interface TrackVO {
  event_type: string
  event_source: string
  url: string
  app_code: string
  app_name: string
  record_screen: string
  user_id?: string
  ip_address?: string
  device?: string
  browser?: string
  send_time: number
  message: string
}
