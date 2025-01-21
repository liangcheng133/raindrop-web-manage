import { classNameBind } from '@/utils/classnamesBind'
import { Flex } from 'antd'
import React from 'react'
import styles from '../index.less'

const cx = classNameBind(styles)

const SecuritySetting: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className={cx('security-setting-container')}>
      <Flex className={cx('security-setting-item')} gap={16} align='center'>
        <div className={cx('label')}>登陆密码</div>
        <Flex className={cx('content')} flex={1} gap={16}>
          <div className={cx('text')}>
            已设置。密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
          </div>
          <a className={cx('option')}>修改</a>
        </Flex>
      </Flex>
      <Flex className={cx('security-setting-item')} gap={16} align='center'>
        <div className={cx('label')}>安全邮箱</div>
        <Flex className={cx('content')} flex={1} gap={16}>
          <div className={cx('text', 'placeholder')}>您暂未设置邮箱，绑定邮箱可以用来找回密码、接收通知等。</div>
          <a className={cx('option')}>设置</a>
        </Flex>
      </Flex>
    </div>
  )
}

export default SecuritySetting
