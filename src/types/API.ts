import { z } from 'zod'

const BasicVOSchema = z.object({
  remark: z.string().optional(),
  create_user_id: z.string().optional(),
  create_user_name: z.string().optional(),
  update_user_id: z.string().optional(),
  update_user_name: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional()
})

/** 系统用户 */
export const SysUserVOSchema = z
  .object({
    id: z.string().optional(),
    account: z.string().optional(),
    name: z.string().optional(),
    avatar_url: z.string().optional(),
    mobile_phone: z.string().optional(),
    email: z.string().optional(),
    role_ids: z.string().optional(),
    role_names: z.string().optional(),
    org_id: z.string().optional(),
    org_name: z.string().optional(),
    status: z.number().optional(),
    is_admin: z.number().optional()
  })
  .merge(BasicVOSchema)

/** 系统组织 */
export const SysOrgVOSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    parent_id: z.string().optional(),
    order: z.number().optional()
  })
  .merge(BasicVOSchema)

/** 系统角色 */
export const SysRoleVOSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    parent_id: z.string().optional(),
    order: z.number().optional()
  })
  .merge(BasicVOSchema)

/** 系统菜单 */
export const SysMenuVOSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    number: z.string().optional(),
    type: z.number().optional(),
    parent_id: z.string().optional(),
    auth: z.number().optional()
  })
  .merge(BasicVOSchema)

/** 登录 */
export const LoginVOSchema = z.object({
  token: z.string(),
  user_id: z.string()
})

/** 保存角色菜单权限 */
export const SysRoleMenuSaveDTOSchema = z.object({
  role_id: z.string(),
  menu_ids: z.string()
})

/** 权限信息 */
const AuthSchema: z.ZodType<any> = z.lazy(() => z.record(z.union([z.boolean(), AuthSchema])))
/** 登录用户信息、权限信息 */
export const SysLoginUserVOSchema = z.object({
  user_info: SysUserVOSchema,
  auths: AuthSchema
})

/** 响应信息 */
export type ResponseType<T> = {
  status: number
  msg: string
  data: T
  errMsg?: string
}
/** 通用字段 */
export type BasicFieldType = z.infer<typeof BasicVOSchema>
/** 系统用户 */
export type SysUserVOType = z.infer<typeof SysUserVOSchema>
/** 系统组织 */
export type SysOrgVOType = z.infer<typeof SysOrgVOSchema>
/** 系统角色 */
export type SysRoleVOType = z.infer<typeof SysRoleVOSchema>
/** 系统菜单 */
export type SysMenuVOType = z.infer<typeof SysMenuVOSchema>
/** 登录 */
export type LoginVOType = z.infer<typeof LoginVOSchema>
/** 保存角色关联菜单 */
export type SysRoleMenuSaveDTOType = z.infer<typeof SysRoleMenuSaveDTOSchema>
/** 登录用户信息、权限信息 */
export type SysLoginUserVOType = z.infer<typeof SysLoginUserVOSchema>
