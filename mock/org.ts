import { Request, Response } from 'express'
import mockjs from 'mockjs'

const data = [
  {
    id: '1',
    name: '雨滴博客',
    parent_id: '0'
  },
  {
    id: '2',
    name: '测试',
    parent_id: '0'
  },
  {
    id: '3',
    name: '开发组',
    parent_id: '1'
  },
  {
    id: '4',
    name: '测试组',
    parent_id: '1'
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
      const newData = { ...params, ...data[index] }
      data[index] = newData
    } else {
      params.id = mockjs.Random.id()
      data.push(params)
    }
    res.status(200).json({ status: 0, msg: null, data: null })
  }
}
