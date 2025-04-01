import { Spin } from 'antd'
import React from 'react'
import { Navigate, Outlet, useAccess, useLocation, useModel, useSelectedRoutes } from 'umi'

const AuthWrappers: React.FC = () => {
  const { getUserAuthLoading } = useModel('global')
  const selectedRoutes = useSelectedRoutes()
  const access = useAccess()
  const location = useLocation()

  const currentRoute = selectedRoutes[selectedRoutes.length - 1]
  console.log(currentRoute, location, access)
  const isLogin = true
  if (getUserAuthLoading) {
    return <Spin />
  }
  if (isLogin) {
    return <Outlet />
  } else {
    return <Navigate to='/login' />
  }
}

export default AuthWrappers
