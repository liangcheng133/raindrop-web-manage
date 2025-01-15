import { ProColumns } from '@ant-design/pro-components'
import { ProTableProps, RequestData } from '@ant-design/pro-table'
import React from 'react'

// 泛用json [key: string]: string;

// 提取 render 函数的参数类型
export type RenderFunctionParams<T> = Parameters<ProColumns<T>['render']>

export type RenderOperationType<T> = {
  label?: string
  key?: string
  icon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
  onClick?: (record: any) => void
}

export type UseTableColumnsType<T> = ProColumns & {
  /**
   * 列类型
   * * operation: 操作列
   */
  type?: 'operation'
  /** 操作列的按钮渲染函数 */
  renderOperation?: (...args: RenderFunctionParams<T>) => RenderOperationType<T>[]
}

export type UseTableType<T, U> = Omit<ProTableProps<T, U>, 'columns'> & {
  /** 接口地址 */
  api: string
  /** 请求前处理请求参数 */
  handleParams?: (params: U) => any
  /** 列配置 */
  columns?: UseTableColumnsType<T>[]
}
