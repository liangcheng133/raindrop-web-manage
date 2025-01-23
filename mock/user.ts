import { Request, Response } from 'express'
import mockjs from 'mockjs'


// 拓展mockjs
mockjs.Random.extend({
  // 按前缀 随机生成手机号
  phone: function () {
    let phonePrefixs = ['132', '135', '189'] // 手机号前缀
    return mockjs.Random.pick(phonePrefixs) + mockjs.mock(/\d{8}/)
  }
})

const maxCount = 26
const data = [
  {
    id: '1',
    name: '陈三',
    account: 'chensan',
    password: '123456',
    mobile_phone: '13212345678',
    email: 'zhangsan@163.com',
    role_number: 'admin',
    status: 0,
    create_time: '2021-01-01 00:00:00',
    update_time: '2021-01-01 00:00:00'
  }
]

for (let i = 1; i < maxCount; i++) {
  data.push(
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
}

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
      total: data.length,
      current: req.body.current,
      pageSize: req.body.pageSize,
      data: [...data].splice((req.body.current - 1) * req.body.pageSize, req.body.pageSize)
    })
  },
  'POST /sys/user/save': (req: Request, res: Response) => {
    const params = req.body
    if (params.id) {
      const index = data.findIndex((item) => item.id === params.id)
      data[index] = params
    } else {
      const index = data.length
      params.id = index
      data.push(params)
    }
    res.status(200).json({
      status: 0,
      msg: null,
      total: data.length,
      current: req.body.current,
      pageSize: req.body.pageSize,
      data: params
    })
  }
}
