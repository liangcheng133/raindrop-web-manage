import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Col, Row, Space } from 'antd'
import React from 'react'

const BasicInformation: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <ProForm
      layout='horizontal'
      labelAlign='right'
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 14 }}
      colon={false}
      submitter={{
        render: (props, doms) => {
          return (
            <Row>
              <Col span={14} offset={3}>
                <Space>{doms}</Space>
              </Col>
            </Row>
          )
        }
      }}>
      <ProFormText width='md' name='account' label='账号' />
      <ProFormText width='md' name='name' label='名称' placeholder='请输入名称' />
      <ProFormText width='md' name='organization' label='组织' />
      <ProFormText width='md' name='role' label='角色' />
      <ProFormTextArea width='md' name='remark' label='个人简介' />
    </ProForm>
  )
}

export default BasicInformation
