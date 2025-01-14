import { ProColumns } from '@ant-design/pro-components'
import { ProTableProps } from '@ant-design/pro-table'
import { request } from '@umijs/max'
import React, { useRef } from 'react'

// 泛用json [key: string]: string;

export type ResponseType = {
  /** 列数据 */
  data: any[]
  /** 总数 */
  total: number
  /** 是否成功 */
  success: boolean
}

export type HandleOperationType<T> = {
  label?: string
  key?: string
  icon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
  onClick?: (record: T) => void
}

export type UseTableColumnsType<T> = ProColumns & {
  /**
   * 列类型
   * * operation: 操作列
   */
  type?: 'operation'
  /** 操作列的按钮渲染函数 */
  handleOperation?: (record: T) => HandleOperationType<T>[]
}

export type UseTableType<T, U> = ProTableProps<T, U> & {
  /** 接口地址 */
  api: string
  /** 请求前处理请求参数 */
  handleParams?: (params: U) => any
}

/** 默认的 rowKey */
const DEFAULT_ROW_KEY = 'id'

const TdCell = (props: any) => {
  // onMouseEnter, onMouseLeave在数据量多的时候，会严重阻塞表格单元格渲染，严重影响性能
  const { onMouseEnter, onMouseLeave, ...restProps } = props
  return <td {...restProps} />
}

/** 封装 ProTable 常用的属性 与 请求方法 */
export default function useTable<T, U>(options: UseTableType<T, U>): ProTableProps<T, U> {
  const defaultProps = {
    rowKey: DEFAULT_ROW_KEY,
    virtual: true,
    scroll: { x: 1000, y: 300 }
  }
  const { api, handleParams, columns: propsColumns, ...rest } = options
  const oldResponse = useRef<ResponseType | null>(null)
  const columns = handleColumns(options)

  return {
    ...defaultProps,
    ...rest,
    columns,
    components: {
      body: TdCell
    },
    request: async (requestParams) => {
      const params = handleTableParams(requestParams, options)
      console.log('[ params ] >', params)

      try {
        const res = await request(api, { method: 'post', data: params })

        const response = {
          data: res.data,
          total: res.total,
          success: true
        }
        oldResponse.current = response

        return response
      } catch (error) {
        console.log('[ useTable 的 request 报错了 ] >', error)
        return {
          ...oldResponse?.current,
          success: false
        }
      }
    }
  }
}

/** 处理请求参数 */
function handleTableParams<T, U>(requestParams: U, { handleParams }: UseTableType<T, U>) {
  if (handleParams) {
    return handleParams(requestParams)
  }
  return requestParams
}

/** 处理 columns */
function handleColumns<T, U>({ columns: propsColumns }: UseTableType<T, U>) {
  const baseColumns = {
    width: 100
  }
  const columns = propsColumns?.map((item) => {
    const newItem = { ...baseColumns, ...item }
    return newItem
  })
  return columns
}
