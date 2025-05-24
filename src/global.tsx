import React from 'react'

const GlobalIndex: React.FC<React.PropsWithChildren> = (props) => {
  console.log('GlobalIndex render')
  return <div> 这是 GlobalIndex 组件 </div>
}

export default GlobalIndex
