import { ResponseType, TrackType } from '@/types/API'
import { request } from '@umijs/max'

/** 查询行为跟踪日志列表 */
export function queryTrackListAPI(data: Record<string, any>): Promise<ResponseType<TrackType>> {
  return request<ResponseType<TrackType>>('/sys/track/list', {
    method: 'post',
    data
  })
}
