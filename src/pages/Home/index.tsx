import { classNameBind } from '@/utils/classnamesBind';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const cx = classNameBind(styles);

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={cx('container')}>{name}</div>
    </PageContainer>
  );
};

export default HomePage;
