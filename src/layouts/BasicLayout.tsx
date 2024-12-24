import React from 'react'

export interface BasicLayoutProps {
  children: React.ReactNode
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  console.log('BasicLayout init')
  return children
}

export default BasicLayout
