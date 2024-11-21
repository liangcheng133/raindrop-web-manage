import { classNameBind } from '@/utils/classnamesBind'
import style from './index.less'

const cx = classNameBind(style)

const Login: React.FC = () => {
  return <div className={cx('container')}> 这是 Login 组件 </div>
}

export default Login
