declare namespace API {
  /** 基础响应 */
  type BasicResponse<T> = {
    status: number
    msg: string
    data: T
  }
  /** 成功响应信息 */
  type SuccessResponse = BasicResponse<null>
  /** 错误响应信息 */
  type ErrorResponse = BasicResponse<null> & {
    errMsg: string
  }
  type BasicParams = {
    current?: number
    count?: number
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
  type SystemUser = BasicField & {
    id?: string
    account?: string
    name?: string
    avatar_url?: string
    mobile_phone?: string
    email?: string
    org_id?: string
    org_name?: string
    role_ids?: string
    role_names?: string
    status?: integer
  }
  /** 系统组织 */
  type SystemOrg = BasicField & {
    id?: string
    name?: string
    order?: number
    parent_id?: string
  }
  /** 系统角色 */
  type SystemRole = BasicField & {
    id?: string
    name?: string
    order?: number
  }
}
