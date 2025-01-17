import { ProColumns, TableDropdown } from '@ant-design/pro-components'
import { ProTableProps, RequestData } from '@ant-design/pro-table'
import { DropdownProps } from '@ant-design/pro-table/es/components/Dropdown/index'
import { request } from '@umijs/max'
import React, { ReactNode, useRef, useState } from 'react'
import 'react-resizable/css/styles.css' // 引入默认样式
import {
  ColumnOptions,
  RenderFunctionParams,
  RequestFunctionParams,
  UseTableColumnsType as UseTableColumnsTypeProps,
  UseTableType as UseTableTypeProps
} from './type'

export type UseTableProps<T, U> = UseTableTypeProps<T, U>
export type UseTableColumnsType<T> = UseTableColumnsTypeProps<T>

/** 默认的列宽 */
const DEFAULT_COLUMN_WIDTH = 120
/** 默认表格配置 */
const DEFAULT_PROPS = {
  rowKey: 'id',
  scroll: { x: 'max-content', y: 400 },
  resizable: true
}

/** 封装 ProTable 常用的属性 与 请求方法 */
export default function useTable<T, U>(useTableProps: UseTableProps<T, U>): ProTableProps<T, U> {
  const options = { ...DEFAULT_PROPS, ...useTableProps }
  const { api, handleParams, columns: propsColumns, tableLayout = 'fixed', ...rest } = options

  const [columnOptions, setColumnOptions] = useState<ColumnOptions>({})
  const oldResponse = useRef<RequestData<T> | null>(null)

  const columns = handleColumns(options, columnOptions, setColumnOptions)

  return {
    ...rest,
    columns,
    components: {},
    request: async (...args) => {
      const params = handleTableParams(...args, options)

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
function handleTableParams<T, U>(
  params: RequestFunctionParams<T, U>[0],
  sort: RequestFunctionParams<T, U>[1],
  filter: RequestFunctionParams<T, U>[2],
  { handleParams }: UseTableProps<T, U>
) {
  let requestParams = { ...params }
  if (handleParams) {
    requestParams = handleParams(params, sort, filter)
  }
  return requestParams
}

/** 处理 columns */
function handleColumns<T, U>(
  { columns: propsColumns, resizable }: UseTableProps<T, U>,
  columnOptions: ColumnOptions,
  setColumnOptions: (value: ColumnOptions) => void
) {
  const columns = propsColumns?.map((item) => {
    const { type, ellipsis = true, onHeaderCell, ...rest } = item
    const extra: ProColumns<T> = {
      width: DEFAULT_COLUMN_WIDTH
    }

    if (item.valueType === 'option') {
      Object.assign(extra, {
        title: '操作',
        fixed: 'right',
        render: (...args) => renderColumnOperation(item, ...args)
      } as ProColumns)
    }

    if (resizable && !onHeaderCell) {
      // extra.width = columnOptions[resizableKey]?.width ?? width
    }

    return {
      ...extra,
      ...rest
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
    const dropdownItems: DropdownProps['menus'] = []
    const operationMaxShowQuantity = column.operationMaxShowQuantity ?? 3

    renderOperations.forEach((rItem, rIndex) => {
      const { name, key, hide, outside, onClick, ...rest } = rItem
      const callClick = () => {
        onClick?.()
      }
      if (hide !== true) {
        if (buttonsRender.length < operationMaxShowQuantity - 1 || outside) {
          buttonsRender.push(
            <a key={key} onClick={callClick}>
              {name}
            </a>
          )
        } else {
          dropdownItems.push({ key: key, name, ...rest })
        }
      }
    })
    const renders = [...buttonsRender]
    if (dropdownItems.length > 0) {
      renders.push(
        <TableDropdown
          key='actionGroup'
          onSelect={(key) => {
            renderOperations.find((item) => item.key === key)?.onClick?.()
          }}
          menus={dropdownItems}
        />
      )
    }
    return renders
  }
}
