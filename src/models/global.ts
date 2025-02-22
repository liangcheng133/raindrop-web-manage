// 全局共享数据示例
import { WEB_NAME } from '@/constants';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(WEB_NAME);
  return {
    name,
    setName,
  };
};

export default useUser;
