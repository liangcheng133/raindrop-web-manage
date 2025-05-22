import { sysUserAccountLoginAPI } from '@/services/user'
import { rsaEncrypt } from '@/utils/encrypt'
import { validateZodField } from '@/utils/zodUtil'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { Button, Form } from 'antd'
import React from 'react'
import z from 'zod'

const LoginDTOSchema = z.object({
  account: z.string().min(1, '请输入账号zod'),
  password: z.string().min(1, '请输入密码zod')
})
type LoginDTOType = z.infer<typeof LoginDTOSchema>

/** 账号登录表单 */
const AccountForm: React.FC = () => {
  const [form] = Form.useForm()

  const { handleLoginSuccess } = useModel('user')

  const validateField = async <TKey extends keyof LoginDTOType>(field: TKey, value: LoginDTOType[TKey]) => {
    const errStr = validateZodField(LoginDTOSchema, field, value)
    if (errStr) {
      throw new Error(errStr)
    }
  }

  const handleUserLogin = async (params: LoginDTOType) => {
    try {
      const res = await sysUserAccountLoginAPI(params)
      handleLoginSuccess(res.data)
    } catch (error) {
      console.log('登录失败', error)
    }
  }

  const onFinish = async (values: LoginDTOType) => {
    const validResult = LoginDTOSchema.safeParse(values)
    if (validResult.success) {
      const validData = validResult.data
      validData.password = await rsaEncrypt(validData.password)
      await handleUserLogin(validData)
      return true
    } else {
      console.error('校验失败:', validResult.error.format())
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
        rules={[{ required: true, validator: (_, value) => validateField('account', value) }]}
      />
      <ProFormText.Password
        name='password'
        label='密码'
        placeholder='请输入密码'
        rules={[{ required: true, validator: (_, value) => validateField('password', value) }]}
      />
    </ProForm>
  )
}

export default AccountForm
