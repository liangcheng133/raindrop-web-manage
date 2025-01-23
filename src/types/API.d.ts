declare namespace API {
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
    role_number?: string
    status?: integer
    remark?: string
  }
}
