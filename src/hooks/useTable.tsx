import { objRemoveEmpty } from '@/utils'
import { ProColumns, RequestData } from '@ant-design/pro-components'
import { ProTableProps } from '@ant-design/pro-table'
import { useSafeState } from 'ahooks'
import { TableProps } from 'antd'
import { SortOrder } from 'antd/es/table/interface'
import { cloneDeep, throttle } from 'es-toolkit'
import { useEffect, useRef } from 'react'

export type ColumnsType<T> = ProColumns<T>

export type ScrollType = TableProps<any>['scroll'] & {
  scrollToFirstRowOnChange?: boolean
}
export type RequestFunctionParams<T, U> = Parameters<ProTableProps<T, U>['request']>

export type UserTableProps<T, U> = {
  /** 表格配置 */
  config: ProTableProps<T, U>
  /** 更新表格高度 */
  refreshTableScroll: () => void
}

export type HandleParams<U> = (
  params: Record<string, any>,
  sort: Record<string, SortOrder>,
  filter: Record<string, (string | number)[] | null>
) => any

export type UseTableConfigType<T, U> = Omit<ProTableProps<T, U>, 'columns'> & {
  /** 接口地址 */
  api?: (...args: any) => Promise<any>
  /**
   * 请求前处理请求参数
   * @param params 请求参数
   */
  handleParams?: HandleParams<U>
  /** 处理请求响应数据 */
  handleResponse?: (...args: any) => any
  /** 是否在请求时清除空参数，默认为true */
  clearEmptyParams?: boolean
  /** 列配置 */
  columns?: ColumnsType<T>[]
  /** 计算表格高度阈值 */
  calcTableHeightThreshold?: number
  /**
   * 持久化列配置的key，传入值时即开启持久化列配置，默认使用localStorage
   */
  persistenceColumnsKey?: string
}

/** 默认的列宽 */
const DEFAULT_COLUMN_WIDTH = 150
/** 默认表格高度 */
const DEFAULT_TABLE_HEIGHT = 400

/** 处理列配置项 */
const handleColumns = <T, U>(config: ProTableProps<T, U>, initialConfig: UseTableConfigType<T, U>) => {
  const { columns } = initialConfig
  config.columns = columns?.map((item) => {
    const { width = DEFAULT_COLUMN_WIDTH, ...rest } = item

    return {
      ...rest,
      width
    }
  })
}

/** 处理表格滚动 */
const handleScroll = <T, U>(config: ProTableProps<T, U>, initialConfig: UseTableConfigType<T, U>) => {
  const { calcTableHeightThreshold } = initialConfig

  const [height, setHeight] = useSafeState(DEFAULT_TABLE_HEIGHT) // 表格高度

  const refresh = () => {
    setHeight(calcTableHeight(calcTableHeightThreshold!))
  }
  useEffect(() => {
    window.onresize = throttle(refresh, 300, { edges: ['leading'] })
    return () => {
      window.onresize = null
    }
  }, [])

  config.scroll = { x: 'max-content', y: height, ...scroll }
  return {
    refresh
  }
}

/** 处理列状态 */
const handleColumnState = <T, U>(config: ProTableProps<T, U>, initialConfig: UseTableConfigType<T, U>) => {
  const { persistenceColumnsKey, columnsState } = initialConfig
  config.columnsState = {
    persistenceKey: persistenceColumnsKey,
    persistenceType: 'localStorage',
    ...columnsState
  }
}

/** 处理请求 */
const handleRequest = <T, U>(config: ProTableProps<T, U>, initialConfig: UseTableConfigType<T, U>) => {
  const { api, handleParams, clearEmptyParams, handleResponse } = initialConfig
  const lastResponse = useRef<RequestData<T>>() // 上一次请求的结果

  if (api) {
    /** 处理表格请求参数 */
    const handleTableParams = (
      params: RequestFunctionParams<T, U>[0],
      sort: RequestFunctionParams<T, U>[1],
      filter: RequestFunctionParams<T, U>[2]
    ) => {
      const { current, pageSize, ...rest } = params
      let requestParams = { ...rest, current: current, count: pageSize }
      if (handleParams) {
        requestParams = handleParams(requestParams, sort, filter)
      }
      if (clearEmptyParams) {
        objRemoveEmpty(requestParams)
      }
      return requestParams
    }

    config.request = async (...args) => {
      try {
        const params = handleTableParams(...args)
        const res = (await api(params)) as RequestData<T>
        let response = {
          data: res.data,
          total: res.total,
          success: true
        }
        if (handleResponse) {
          response = handleResponse(response)
        }
        lastResponse.current = response
        return response
      } catch (error) {
        return {
          ...lastResponse?.current,
          success: false
        }
      }
    }
  }
}

/** 初始话配置项 */
const handleInitialConfig = <T, U>(initialConfig?: UseTableConfigType<T, U>) => {
  const config: UseTableConfigType<T, U> = {
    rowKey: 'id',
    search: {
      labelWidth: 'auto',
      layout: 'inline'
    }
  }
  if (initialConfig) {
    const { clearEmptyParams = true, calcTableHeightThreshold = 100, ...rest } = cloneDeep(initialConfig)
    Object.assign(config, { ...rest, clearEmptyParams, calcTableHeightThreshold })
  }

  console.log('[ handleInitialConfig config ] >', config)
  return config
}

/** antd Pro表格配置封装 */
const useTable = <T, U>(initialConfig?: UseTableConfigType<T, U>): UserTableProps<T, U> => {
  const tableConfig: ProTableProps<T, U> = {}
  const initialConfigData = handleInitialConfig(initialConfig)
  Object.assign(tableConfig, initialConfigData)

  // 处理列配置
  handleColumns(tableConfig, initialConfigData)

  // 处理表格宽高scroll
  const { refresh: refreshTableScroll } = handleScroll(tableConfig, initialConfigData)

  // 处理列状态
  handleColumnState(tableConfig, initialConfigData)

  // 处理请求
  handleRequest(tableConfig, initialConfigData)

  console.log('[ tableConfig ] >', tableConfig)
  return {
    config: tableConfig,
    refreshTableScroll
  }
}

export default useTable

/**
 * 计算表格可用高度
 * @param threshold 阈值，高度会减少该阈值 默认为100
 * @returns
 */
function calcTableHeight(threshold: number) {
  const clientHeight = document.documentElement.clientHeight
  const bodyArr = document.getElementsByClassName('ant-table-body')
  if (bodyArr.length) {
    return clientHeight - bodyArr[0].getBoundingClientRect().top - threshold
  }
  return DEFAULT_TABLE_HEIGHT
}
