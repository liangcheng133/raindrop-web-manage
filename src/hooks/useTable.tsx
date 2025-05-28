import { ProColumns } from '@ant-design/pro-components'
import { ProTableProps } from '@ant-design/pro-table'
import { useSafeState } from 'ahooks'
import { TableProps } from 'antd'
import { cloneDeep, throttle } from 'es-toolkit'
import { useEffect } from 'react'

export type ColumnsType<T> = ProColumns<T>

export type ScrollType = TableProps<any>['scroll'] & {
  scrollToFirstRowOnChange?: boolean
}

export type UseTableConfigType<T, U> = Omit<ProTableProps<T, U>, 'columns'> & {
  /** 接口地址 */
  api?: (...args: any) => Promise<any>
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
  config.columns = columns
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
    /** 更新表格高度 */
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
  return {}
}

/** 初始话配置项 */
const handleInitialConfig = <T, U>(initialConfig?: UseTableConfigType<T, U>): UseTableConfigType<T, U> => {
  const config = {
    rowKey: 'id'
  }
  if (initialConfig) {
    const { clearEmptyParams = true, calcTableHeightThreshold = 100, ...rest } = cloneDeep(initialConfig)
    Object.assign(config, { ...rest, clearEmptyParams, calcTableHeightThreshold })
  }
  return config
}

/** antd Pro表格配置封装 */
const useTable = <T, U>(initialConfig?: UseTableConfigType<T, U>): ProTableProps<T, U> => {
  const tableConfig: ProTableProps<T, U> = {}
  const initialConfigData = handleInitialConfig(initialConfig)

  // 处理列配置
  handleColumns(tableConfig, initialConfigData)

  // 处理表格滚动
  const { refresh: refreshTableScroll } = handleScroll(tableConfig, initialConfigData)

  // 处理列状态
  handleColumnState(tableConfig, initialConfigData)

  // 处理请求
  const {} = handleRequest(tableConfig, initialConfigData)

  console.log('[ tableConfig ] >', tableConfig)
  return tableConfig
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
