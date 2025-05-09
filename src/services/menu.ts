import { request } from '@umijs/max'

/** 获取所有菜单 */
export function querySysMenuListAllAPI(): Promise<API.Response<API.SysMenuVO[]>> {
  return request('/sys/menu/listAll', {
    method: 'post'
  })
}
