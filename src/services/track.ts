import { ResponseVO, TrackVO } from '@/types/api'
import { request } from '@umijs/max'

/** 查询行为跟踪日志列表 */
export function queryTrackListAPI(data: any) {
  return request<ResponseVO<TrackVO[]>>('/sys/track/list', {
    method: 'post',
    data
  })
}
