import React from 'react'
import { Navigate, Outlet, useAccess, useLocation, useModel, useSelectedRoutes } from 'umi'

const AuthWrappers: React.FC = () => {
  const selectedRoutes = useSelectedRoutes()
  const access = useAccess()
  const location = useLocation()

  const currentRoute = selectedRoutes[selectedRoutes.length - 1]
  console.log(currentRoute, location, access)
  const isLogin = true
  if (isLogin) {
    return <Outlet />
  } else {
    return <Navigate to='/login' />
  }
}

export default AuthWrappers
