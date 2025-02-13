import { cloneDeep } from 'es-toolkit'
import { Request, Response } from 'express'
import mockjs from 'mockjs'

type OrgUpdateOrderType = {
  id: string
  parent_id: string
  order: number
}

const data = [
  {
    id: 'root_1111',
    name: '雨滴',
    parent_id: '0',
    order: 1
  },
  {
    id: '2',
    name: '测试',
    parent_id: '0',
    order: 2
  },
  {
    id: '3',
    name: '开发组',
    parent_id: 'root_1111',
    order: 1
  },
  {
    id: '4',
    name: '测试组',
    parent_id: 'root_1111',
    order: 2
  }
]

export default {
  /** 获取组织列表 */
  'POST /sys/org/listAll': (req: Request, res: Response) => {
    res.status(200).json({
      status: 0,
      msg: null,
      data: [...data]
    })
  },
  /** 新建、编辑组织 */
  'POST /sys/org/save': (req: Request, res: Response) => {
    const params = req.body
    if (params.id) {
      const index = data.findIndex((item) => item.id === params.id)
      const newData = { ...data[index], ...params }
      data[index] = newData
    } else {
      params.id = mockjs.Random.id()
      data.push(params)
    }
    res.status(200).json({ status: 0, msg: null, data: null })
  },
  /** 排序组织 */
  'POST /sys/org/sort': (req: Request, res: Response) => {
    const params: OrgUpdateOrderType[] = req.body
    if (params) {
      params.forEach((item) => {
        const index = data.findIndex((dataItem) => dataItem.id === item.id)
        if (index !== -1) {
          data[index].order = item.order
          data[index].parent_id = item.parent_id
        }
      })
    }
    res.status(200).json({ status: 0, msg: null, data: null })
  },
  /** 删除组织以及下级组织 */
  'POST /sys/org/remove': (req: Request, res: Response) => {
    const params = req.body
    if (params.id) {
      if (params.id === '1111') {
        return res.status(200).json({ status: 1, msg: '不能删除根节点', data: null })
      }
      cloneDeep(data).forEach((item, index) => {
        if (params.id === item.id || item.parent_id === params.id) {
          data.splice(index, 1)
        }
      })
    }
    res.status(200).json({ status: 0, msg: null, data: null })
  }
}
