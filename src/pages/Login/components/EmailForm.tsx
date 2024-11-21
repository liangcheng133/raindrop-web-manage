import { Button, Form, Input } from 'antd'
import React from 'react'

const EmailForm: React.FC = () => {
  const [form] = Form.useForm()
  return (
    <Form form={form} layout='vertical'>
      <Form.Item name='username' label='邮箱'>
        <Input />
      </Form.Item>
      <Form.Item name='password' label='验证码'>
        <Input />
      </Form.Item>
      <Button htmlType='submit' type='primary' block>
        登录
      </Button>
    </Form>
  )
}

export default EmailForm
