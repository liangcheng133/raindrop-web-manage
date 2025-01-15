import { ProColumns } from '@ant-design/pro-components'
import { ProTableProps, RequestData } from '@ant-design/pro-table'
import { request } from '@umijs/max'
import { Space } from 'antd'
import React, { ReactNode, useRef } from 'react'
import {
  RenderFunctionParams,
  UseTableColumnsType as UseTableColumnsTypeProps,
  UseTableType as UseTableTypeProps
} from './useTableTypes'

export type UseTableProps<T, U> = UseTableTypeProps<T, U>
export type UseTableColumnsType<T> = UseTableColumnsTypeProps<T>

/** 默认的列宽 */
const DEFAULT_COLUMN_WIDTH = 120
/** 默认表格配置 */
const DEFAULT_PROPS = {
  rowKey: 'id',
  virtual: true,
  scroll: { x: 1000, y: 300 }
}

/** 封装 ProTable 常用的属性 与 请求方法 */
export default function useTable<T, U>(options: UseTableProps<T, U>): ProTableProps<T, U> {
  const { api, handleParams, columns: propsColumns, ...rest } = options
  const columns = handleColumns(options)
  const oldResponse = useRef<RequestData<T> | null>(null)

  return {
    ...DEFAULT_PROPS,
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
function handleTableParams<T, U>(requestParams: U, { handleParams }: UseTableProps<T, U>) {
  if (handleParams) {
    return handleParams(requestParams)
  }
  return requestParams
}

/** 处理 columns */
function handleColumns<T, U>({ columns: propsColumns }: UseTableProps<T, U>) {
  const baseColumns = {
    width: DEFAULT_COLUMN_WIDTH
  }
  const columns = propsColumns?.map((item) => {
    const extra: ProColumns<T> = {}

    if (item.type === 'operation') {
      Object.assign(extra, {
        title: '操作',
        fixed: 'right',
        width: 120,
        render: (...args) => renderColumnOperation(item, ...args)
      } as ProColumns)
    }
    return {
      ...baseColumns,
      ...extra,
      ...item
    }
  })
  return columns
}

/** 处理 columns 操作列 */
function renderColumnOperation<T>(
  column: UseTableColumnsType<T>,
  dom: RenderFunctionParams<T>[0],
  record: RenderFunctionParams<T>[1],
  index: RenderFunctionParams<T>[2],
  action: RenderFunctionParams<T>[3],
  schema: RenderFunctionParams<T>[4]
): ReactNode {
  const renderOperation = column.renderOperation
  if (renderOperation) {
    const renderOperations = renderOperation(dom, record, index, action, schema)
    const buttonsRender: ReactNode[] = []
    renderOperations.forEach((item) => {
      const { label, key, icon, disabled, tooltip, onClick } = item
      buttonsRender.push(
        <a key={key} onClick={() => onClick?.(record)}>
          {label}
        </a>
      )
    })
    return <Space>{buttonsRender}</Space>
  }
}

const TdCell = (props: any) => {
  // onMouseEnter, onMouseLeave在数据量多的时候，会严重阻塞表格单元格渲染，严重影响性能
  const { onMouseEnter, onMouseLeave, ...restProps } = props
  return <td {...restProps} />
}
