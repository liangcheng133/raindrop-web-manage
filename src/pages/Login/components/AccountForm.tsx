import { sysUserAccountLoginAPI } from '@/services/user'
import { AccountLoginDTO } from '@/types/api'
import { handleError } from '@/utils'
import { rsaEncrypt } from '@/utils/encrypt'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { Button, Form } from 'antd'
import React from 'react'

/** 账号登录表单 */
const AccountForm: React.FC = () => {
  const { handleLoginSuccess } = useModel('user')

  const [form] = Form.useForm()

  const onFinish = async (values: AccountLoginDTO) => {
    try {
      values.password = await rsaEncrypt(values.password)
      const res = await sysUserAccountLoginAPI(values)
      handleLoginSuccess(res.data)
      return true
    } catch (error) {
      handleError(error)
      console.log('[ 登录error ] >', error)
      return false
    }
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
