import { Request, Response } from 'express'
import mockjs from 'mockjs'

export default {
  /** 获取用户列表 */
  'POST /sys/user/list': (req: Request, res: Response) => {
    res.status(200).json(
      mockjs.mock({
        status: 0,
        msg: null,
        'data|10': [
          {
            id: '@id',
            name: '@cname',
            account: '@email',
            phone: '@phone',
            email: '@email',
            role_number: '@id',
            status: '@boolean',
            createTime: '@datetime',
            updateTime: '@datetime'
          }
        ]
      })
    )
  }
}
