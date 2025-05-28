import { Outlet, useModel } from '@umijs/max'
import { isEmpty } from 'es-toolkit/compat'
import React, { useEffect } from 'react'

/** 系统布局 - 全局预加载 */
const BasicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useModel('user')
  const { refresh: refreshOrgList } = useModel('org')
  const { refresh: refreshRoleList } = useModel('role')

  useEffect(() => {
    if (!isEmpty(token)) {
      refreshOrgList(true)
      refreshRoleList(true)
    }
  }, [token])

  return <Outlet />
}

export default BasicLayout
