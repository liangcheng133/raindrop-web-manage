import z from 'zod'

/** 基础字段 */
export const BasicFieldSchema = z.object({
  remark: z.string().optional(),
  create_user_id: z.string().optional(),
  create_user_name: z.string().optional(),
  update_user_id: z.string().optional(),
  update_user_name: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional()
})

/** 账号登录 */
export const AccountLoginDTOSchema = z.object({
  account: z.string().nonempty('请输入账号'),
  password: z.string().nonempty('请输入密码')
})

/** 系统用户类型 */
export const SysUserVOSchema = BasicFieldSchema.merge(
  z.object({
    id: z.string(),
    account: z.string(),
    name: z.string(),
    avatar_url: z.string().optional(),
    mobile_phone: z.string(),
    email: z.string().email(),
    role_ids: z.string().optional(),
    role_names: z.string().optional(),
    org_id: z.string(),
    org_name: z.string(),
    status: z.number(),
    is_admin: z.number()
  })
)

/** 保存用户信息类型 */
export const SysUserSaveDTOSchema = z.object({
  id: z.string().optional(),
  account: z.string(),
  password: z.string().optional(),
  name: z.string(),
  avatar_url: z.string().optional(),
  mobile_phone: z.string(),
  email: z.string().email('请输入正确的邮箱地址'),
  role_ids: z.string().optional(),
  org_id: z.string(),
  status: z.number()
})

/** 系统组织类型 */
export const SysOrgVOSchema = BasicFieldSchema.merge(
  z.object({
    id: z.string(),
    name: z.string(),
    parent_id: z.string(),
    order: z.number().optional()
  })
)

/** 系统角色类型 */
export const SysRoleVOSchema = BasicFieldSchema.merge(
  z.object({
    id: z.string(),
    name: z.string(),
    parent_id: z.string(),
    order: z.number().optional()
  })
)

/** 系统菜单类型 */
export const SysMenuVOSchema = BasicFieldSchema.merge(
  z.object({
    id: z.string(),
    name: z.string(),
    number: z.string(),
    type: z.number(),
    parent_id: z.string(),
    auth: z.number()
  })
)

/** 登录返回信息类型 */
export const AccountLoginVOSchema = z.object({
  token: z.string(),
  user_id: z.string()
})

/** 角色菜单权限类型 */
export const SysRoleMenuSaveDTOSchema = z.object({
  role_id: z.string(),
  menu_ids: z.string()
})

/** 权限信息类型（使用 z.lazy 实现递归结构） */
export const AuthMapSchema: z.ZodType<Record<string, boolean | Record<string, any>>> = z.lazy(() =>
  z.record(z.union([z.boolean(), AuthMapSchema]))
)

/** 登录用户信息类型 */
export const SysLoginUserVOSchema = z.object({
  user_info: SysUserVOSchema,
  auths: AuthMapSchema
})

/** 系统组织树类型 */
export const SysOrgTreeVOSchema = z
  .object({
    children: z.array(z.lazy(() => SysOrgVOSchema)).optional()
  })
  .merge(SysOrgVOSchema)

export interface ResponseVO<T> {
  status: number
  msg: string
  data: T
  errMsg?: string
}
export type BasicField = z.infer<typeof BasicFieldSchema>
export type AccountLoginDTO = z.infer<typeof AccountLoginDTOSchema>
export type SysUserVO = z.infer<typeof SysUserVOSchema>
export type SysOrgVO = z.infer<typeof SysOrgVOSchema>
export type SysRoleVO = z.infer<typeof SysRoleVOSchema>
export type SysMenuVO = z.infer<typeof SysMenuVOSchema>
export type AccountLoginVO = z.infer<typeof AccountLoginVOSchema>
export type SysRoleMenuSaveDTO = z.infer<typeof SysRoleMenuSaveDTOSchema>
export type SysLoginUserVO = z.infer<typeof SysLoginUserVOSchema>
export type SysOrgTreeVO = z.infer<typeof SysOrgTreeVOSchema>
export type SysUserSaveDTO = z.infer<typeof SysUserSaveDTOSchema>
