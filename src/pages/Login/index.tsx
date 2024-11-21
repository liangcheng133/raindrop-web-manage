import LogoImage from '@/assets/img/logo.png'
import { DEFAULT_NAME } from '@/constants'
import { classNameBind } from '@/utils/classnamesBind'
import { Helmet } from '@umijs/max'
import style from './index.less'

const cx = classNameBind(style)

const Login: React.FC = () => {
  return (
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
    </div>
  )
}

export default Login
