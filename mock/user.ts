import { Request, Response } from 'express'
import mockjs from 'mockjs'

// 拓展mockjs
mockjs.Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return mockjs.Random.pick(phonePrefixs) + mockjs.mock(/\d{8}/) //Number()
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
      total: 30,
      current: req.body.current,
      pageSize: req.body.pageSize,
      data: Array(Math.min(req.body.pageSize, 30))
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
