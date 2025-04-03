import { rsaEncrypt } from '@/utils/encrypt'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { Button, Form } from 'antd'
import { cloneDeep } from 'es-toolkit'
import React from 'react'

type SystemUserLoginType = { account: string; password: string }

const AccountForm: React.FC = () => {
  const [form] = Form.useForm()
  const { userLogin } = useModel('user')

  const onFinish = async (values: SystemUserLoginType) => {
    const params = cloneDeep(values)
    params.password = await rsaEncrypt(values.password)
    userLogin(params)
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
      <ProFormText
        name='account'
        label='账号'
        placeholder='请输入账号'
        rules={[{ required: true, message: '请输入账号' }]}
      />
      <ProFormText.Password
        name='password'
        label='密码'
        placeholder='请输入密码'
        rules={[{ required: true, message: '请输入密码' }]}
      />
    </ProForm>
  )
}

export default AccountForm
