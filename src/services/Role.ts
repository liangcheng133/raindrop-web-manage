import { request } from '@umijs/max'

/** 获取所有橘色列表 */
export function querySysRoleListAllApi(): Promise<API.BasicResponse<API.SystemRole[]>> {
  return request('/sys/role/listAll', {
    method: 'post'
  })
}
