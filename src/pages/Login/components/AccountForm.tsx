import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Button, Form } from 'antd'
import { FormProps } from 'antd/lib'
import React from 'react'

type SystemUserLoginType = { account: string; password: string }

const AccountForm: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: SystemUserLoginType) => {
    console.log('[ values ] >', values)
  }

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => {
          return [
            <Button key='submit' type='primary' htmlType='submit' block>
              登录
            </Button>
          ]
        }
      }}>
      <ProFormText name='account' label='账号' rules={[{ required: true, message: '请输入账号' }]} />
      <ProFormText.Password name='password' label='密码' rules={[{ required: true, message: '请输入密码' }]} />
    </ProForm>
  )
}

export default AccountForm
