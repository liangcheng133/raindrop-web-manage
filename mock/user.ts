import { Request, Response } from 'express'
import mockjs from 'mockjs'

// 拓展mockjs
mockjs.Random.extend({
  phone: function () {
    let phonePrefixs = ['132', '135', '189'] // 手机号前缀
    return mockjs.Random.pick(phonePrefixs) + mockjs.mock(/\d{8}/)
  }
})

export default {
  /** 获取用户列表 */
  'POST /sys/user/list': (req: Request, res: Response) => {
    // res.status(200).json({
    //   status: 1,
    //   msg: '服务器错误',
    //   errMsg: 'status 不能为空'
    // })
    // return
    res.status(200).json({
      status: 0,
      msg: null,
      total: 500,
      current: req.body.current,
      pageSize: req.body.pageSize,
      data: Array(Math.min(req.body.current * req.body.pageSize, req.body.pageSize))
        .fill(null)
        .map(() =>
          mockjs.mock({
            id: '@id',
            name: '@cname',
            account: '@email',
            phone: '@phone',
            email: '@email',
            role_number: '@id',
            status: '@boolean',
            create_time: '@datetime',
            update_time: '@datetime'
          })
        )
    })
  }
}
