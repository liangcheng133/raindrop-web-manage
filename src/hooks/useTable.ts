import { ProTableProps } from '@ant-design/pro-table'
import { request } from '@umijs/max'
import { useRef } from 'react'

// 泛用json [key: string]: string;

/**
 * 请求返回的数据类型
 */
export type ResponseType = {
  data: any[]
  total: number
  success: boolean
}

/**
 * useTable 的通用属性
 */
export type UseTableType<T, U> = ProTableProps<T, U> & {
  /** 接口地址 */
  api: string
  /** 请求前处理请求参数 */
  handleParams?: (params: U) => any
}

/** 默认的 rowKey */
const DEFAULT_ROW_KEY = 'id'

/**
 * 封装 ProTable 常用的属性 与 请求方法
 */
export default function useTable<T, U>(options: UseTableType<T, U>): ProTableProps<T, U> {
  const { api, handleParams, columns: propsColumns, rowKey = DEFAULT_ROW_KEY, ...rest } = options
  const oldResponse = useRef<ResponseType | null>(null)
  const columns = handleColumns(options)

  return {
    ...rest,
    rowKey,
    columns,
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
    ellipsis: true
  }
  const columns = propsColumns?.map((item) => {
    const newItem = { ...baseColumns, ...item }
    return newItem
  })
  return columns
}
