import { Request, Response } from 'express'

const data = [
  {
    id: 'role_root_1',
    name: '系统管理员',
    number: 'system',
    order: '1',
    remark: ''
  },
  {
    id: '2',
    name: '仅查看',
    number: 'onlyView',
    order: '2',
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
  }
}
