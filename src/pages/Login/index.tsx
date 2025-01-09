import LogoImage from '@/assets/img/logo.png'
import { DEFAULT_NAME } from '@/constants'
import { classNameBind } from '@/utils/classnamesBind'
import { Helmet } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Tabs, TabsProps } from 'antd'
import AccountForm from './components/AccountForm'
import EmailForm from './components/EmailForm'
import style from './index.less'

const cx = classNameBind(style)

const TAB_ITEMS: TabsProps['items'] = [
  { key: 'account', label: '账号登录', children: <AccountForm /> },
  { key: 'email', label: '邮箱登录', children: <EmailForm /> }
]

const Login: React.FC = () => {
  const [tabKey, setTabKey] = useSafeState('account')
  console.log('[ Login刷新 ] >')

  return (
    <div className={cx('container-wrapper')}>
      <div className={cx('container')}>
        <Helmet>
          <title>登录 - {DEFAULT_NAME}</title>
        </Helmet>
        <div className={cx('header')}>
          <div className={cx('logo')}>
            <img className={cx('logo')} src={LogoImage} />
          </div>
          <div className={cx('title')}>登录 {DEFAULT_NAME}</div>
        </div>
        <div className={cx('body')}>
          <Tabs className={cx('tabs')} activeKey={tabKey} items={TAB_ITEMS} centered onTabClick={setTabKey} />
        </div>
      </div>
    </div>
  )
}

export default Login
