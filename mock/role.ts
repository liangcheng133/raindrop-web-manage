import { Request, Response } from 'express'
import mockjs from 'mockjs'

type SystemRoleType = {
  id: string
  name: string
  number: string
  order: number
  remark: string
}

const data = [
  {
    id: 'role_root_1',
    name: '系统管理员',
    number: 'system',
    order: 1,
    remark: ''
  },
  {
    id: '2',
    name: '仅查看',
    number: 'onlyView',
    order: 2,
    remark: ''
  },
  {
    id: '3',
    name: '这是一段超级无敌长长长长长长长长长长长长长长长长长长长长长长长长长长的名称',
    number: 'onlyView',
    order: 3,
    remark: ''
  }
]

export default {
  /** 获取角色列表 */
  'POST /sys/role/listAll': (req: Request, res: Response) => {
    res.status(200).json({
      status: 0,
      msg: null,
      data: [...data]
    })
  },
  /** 新建、编辑角色 */
  'POST /sys/role/save': (req: Request, res: Response) => {
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
  /** 排序角色 */
  'POST /sys/role/sort': (req: Request, res: Response) => {
    const params: SystemRoleType[] = req.body
    if (params) {
      params.forEach((item) => {
        const index = data.findIndex((dataItem) => dataItem.id === item.id)
        if (index !== -1) {
          data[index].order = item.order
        }
      })
    }
    res.status(200).json({ status: 0, msg: null, data: null })
  },
  /** 根据id删除用户 */
  'POST /sys/role/delete': (req: Request, res: Response) => {
    const params = req.body
    data.splice(
      data.findIndex((item) => item.id === params.id),
      1
    )
    res.status(200).json({ status: 0, msg: null, data: null })
  }
}
