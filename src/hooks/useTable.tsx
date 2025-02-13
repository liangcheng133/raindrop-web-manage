import { objRemoveEmpty } from '@/utils'
import { ColumnsState, ProColumns, TableDropdown } from '@ant-design/pro-components'
import { ProTableProps, RequestData } from '@ant-design/pro-table'
import { DropdownProps } from '@ant-design/pro-table/es/components/Dropdown/index'
import { request } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Popconfirm } from 'antd'
import { throttle } from 'es-toolkit'
import React, { ReactNode, useEffect, useRef } from 'react'
import 'react-resizable/css/styles.css' // 引入默认样式
import { ColumnOptions, RenderFunctionParams, RequestFunctionParams, UseTableColumnsType, UseTableType } from './type'

/** 默认的列宽 */
const DEFAULT_COLUMN_WIDTH = 120
/** 默认表格高度 */
const DEFAULT_TABLE_HEIGHT = 400
/** 默认表格配置 */
const DEFAULT_PROPS = {
  rowKey: 'id',
  resizable: true,
  clearEmptyParams: true
}

/** 封装 ProTable 常用的属性 与 请求方法 */
export default function useTable<T>(useTableProps: UseTableType<T, any>): ProTableProps<T, any> {
  const [tableBodyHeight, setTableBodyHeight] = useSafeState(DEFAULT_TABLE_HEIGHT)
  const options = {
    ...DEFAULT_PROPS,
    scroll: { x: 'max-content', y: tableBodyHeight },
    ...useTableProps
  }
  const {
    api,
    handleParams,
    clearEmptyParams,
    columns: propsColumns,
    tableLayout = 'fixed',
    persistenceColumnsKey,
    ...rest
  } = options

  const [columnOptions, setColumnOptions] = useSafeState<ColumnOptions>({})
  const columnsStateValue = useRef<Record<string, ColumnsState>>({}) // 持久化列配置数据
  const oldResponse = useRef<RequestData<T> | null>(null) // 上次成功的请求结果

  const columns = handleColumns(options, columnOptions, setColumnOptions) // 列配置

  /** 更新表格高度 */
  const refreshTableHeight = () => {
    setTableBodyHeight(calculationTableBodyHeight())
  }

  useEffect(() => {
    refreshTableHeight()
    window.onresize = throttle(refreshTableHeight, 300)
    return () => {
      window.onresize = null
    }
  }, [])

  return {
    ...rest,
    columns,
    components: {},
    columnsState: persistenceColumnsKey
      ? {
          onChange: (value: Record<string, ColumnsState>) => {
            columnsStateValue.current = value
          },
          persistenceKey: persistenceColumnsKey,
          persistenceType: 'localStorage'
        }
      : undefined,
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
  { handleParams, clearEmptyParams }: UseTableType<T, U>
) {
  let requestParams = { ...params }
  if (handleParams) {
    requestParams = handleParams(params, sort, filter)
  }
  if (clearEmptyParams) {
    objRemoveEmpty(requestParams)
  }
  return requestParams
}

/** 处理 columns */
function handleColumns<T, U>(
  { columns: propsColumns, resizable }: UseTableType<T, U>,
  columnOptions: ColumnOptions,
  setColumnOptions: (value: ColumnOptions) => void
) {
  const columns = propsColumns?.map((item) => {
    const { ellipsis = true, onHeaderCell, ...rest } = item
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
      const { name, key, hide, outside, type, onClick, ...rest } = rItem
      const callClick = () => {
        return onClick?.()
      }
      if (hide !== true) {
        if (buttonsRender.length < operationMaxShowQuantity - 1 || outside) {
          if (type === 'deleteConfirm') {
            buttonsRender.push(
              <Popconfirm
                title='删除提示'
                description='您确定要删除该数据吗？'
                onConfirm={callClick}
                key={key}
                okText='确认'
                cancelText='取消'>
                <a className='danger-color'>{name}</a>
              </Popconfirm>
            )
          } else {
            buttonsRender.push(
              <a key={key} onClick={callClick}>
                {name}
              </a>
            )
          }
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

/**
 * 计算表格可用高度
 * @param threshold 阈值，高度会减少该阈值 默认为100
 * @returns
 */
function calculationTableBodyHeight(threshold = 100) {
  const clientHeight = document.documentElement.clientHeight
  const bodyArr = document.getElementsByClassName('ant-table-body')
  if (bodyArr.length) {
    return clientHeight - bodyArr[0].getBoundingClientRect().top - threshold
  }
  return DEFAULT_TABLE_HEIGHT
}
