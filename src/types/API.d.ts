declare namespace API {
  /** 基础响应 */
  export type BasicResponse<T> = {
    status: number
    msg: string
    data: T
  }
  /** 成功响应信息 */
  export type SuccessResponse = BasicResponse<null>
  /** 错误响应信息 */
  export type ErrorResponse = BasicResponse<null> & {
    errMsg: string
  }
  export type BasicParams = {
    current?: number
    count?: number
  }
  /** 通用字段 */
  export type BasicField = {
    create_user_id?: string
    create_user_name?: string
    update_user_id?: string
    update_user_name?: string
    create_time?: string
    update_time?: string
  }
  /** 系统用户 */
  export type SystemUser = BasicField & {
    id?: string
    account?: string
    name?: string
    avatar_url?: string
    mobile_phone?: string
    email?: string
    org_id?: string
    role_number?: string
    status?: integer
    remark?: string
  }
  /** 系统组织 */
  export type SystemOrg = BasicField & {
    id?: string
    name?: string
    order?: number
    parent_id?: string
  }
  /** 系统角色 */
  export type SystemRole = BasicField & {
    id?: string
    name?: string
    number?: string
    order?: number
    remark?: string
  }
}
