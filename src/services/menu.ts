import { ResponseVO, SysMenuVO } from '@/types/api'
import { request } from '@umijs/max'

/** 获取所有菜单 */
export function querySysMenuListAllAPI(data: any) {
  return request<ResponseVO<SysMenuVO>>('/sys/menu/listAll', {
    method: 'post',
    data
  })
}
