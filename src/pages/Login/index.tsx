import LogoImage from '@/assets/img/logo.png'
import { USER_TOKEN_KEY, WEB_NAME } from '@/constants'
import { classNameBind } from '@/utils/classnamesBind'
import { localGet } from '@/utils/localStorage'
import { Helmet, history } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Modal, Tabs, TabsProps } from 'antd'
import React, { useEffect } from 'react'
import AccountForm from './components/AccountForm'
import EmailForm from './components/EmailForm'
import style from './index.less'

const cx = classNameBind(style)

const TAB_ITEMS: TabsProps['items'] = [
  { key: 'account', label: '账号登录', children: <AccountForm /> },
  { key: 'email', label: '邮箱登录', children: <EmailForm />, disabled: true }
]

const Login: React.FC = () => {
  const [tabKey, setTabKey] = useSafeState('account')

  useEffect(() => {
    // 销毁所有弹窗
    Modal.destroyAll()
    // 有登录时，自动跳转首页
    if (localGet(USER_TOKEN_KEY)) {
      history.replace('/')
    }
  }, [])

  return (
    <div className={cx('container-wrapper')}>
      <div className={cx('container')}>
        <Helmet>
          <title>登录 - {WEB_NAME}</title>
        </Helmet>
        <div className={cx('header')}>
          <div className={cx('logo')}>
            <img className={cx('logo')} src={LogoImage} />
          </div>
          <div className={cx('title')}>登录 {WEB_NAME}</div>
        </div>
        <div className={cx('body')}>
          <Tabs className={cx('tabs')} activeKey={tabKey} items={TAB_ITEMS} centered onTabClick={setTabKey} />
        </div>
      </div>
    </div>
  )
}

export default Login
