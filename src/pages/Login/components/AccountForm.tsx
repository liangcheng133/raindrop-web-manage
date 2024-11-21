import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'

const AccountForm: React.FC = () => {
  const [form] = Form.useForm()
  return (
    <Form form={form} layout='vertical'>
      <Form.Item name='username' label='用户名'>
        <Input />
      </Form.Item>
      <Form.Item name='password' label='密码'>
        <Input.Password />
      </Form.Item>
      <div style={{ marginBottom: '16px' }}>
        <Checkbox>记住密码</Checkbox>
      </div>
      <Button htmlType='submit' type='primary' block>
        登录
      </Button>
    </Form>
  )
}

export default AccountForm
