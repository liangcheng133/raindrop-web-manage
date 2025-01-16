import { ProColumns } from '@ant-design/pro-components'
import { ProTableProps } from '@ant-design/pro-table'

// 泛用json [key: string]: string;

// 提取 render 函数的参数类型
export type RenderFunctionParams<T> = Parameters<ProColumns<T>['render']>

export type RequestFunctionParams<T, U> = Parameters<ProTableProps<T, U>['request']>

export type RenderOperationType<T> = {
  /** 显示文本 */
  name?: string
  /** 用于绑定点击事件，必传 */
  key: string
  /** 是否隐藏 */
  hide?: boolean
  /** 是否从更多按钮提取出来展示 */
  outside?: boolean
  /**
   * 点击事件
   * @param record 当前行数据
   * @param index 当前行索引
   */
  onClick?: () => void
}

export type UseTableColumnsType<T> = ProColumns & {
  /**
   * 列类型
   * * operation: 操作列
   */
  type?: 'operation'
  /**
   * 文本溢出是否省略（该属性已排除，请使用 commEllipsis 这个属性）
   * * 尽量不要在开启虚拟列表的情况下使用。ProTable的实现使用 <Typography.Text /> 这个组件，这个组件内部实现会获取DOM的高度和宽度，导致回流重绘，会让页面严重掉帧 [https://github.com/ant-design/pro-components/issues/4407]
   */
  ellipsis?: boolean
  /** 操作列最大显示数量，超出显示更多按钮 */
  operationMaxShowQuantity?: number
  /**
   * 操作列的按钮渲染函数
   * @param dom 节点内容
   * @param entity 当前行数据
   * @param index 当前行索引
   * @param action Table action 的引用，便于自定义触发
   * @param schema 当前column配置
   * @returns 操作列按钮数组
   */
  renderOperation?: (...args: RenderFunctionParams<T>) => RenderOperationType<T>[]
}

export type UseTableType<T, U> = Omit<ProTableProps<T, U>, 'columns'> & {
  /** 接口地址 */
  api: string
  /** 
   * 对应列是否可以通过拖动改变宽度，默认启用 
   * * 功能未完善
   */
  resizable?: boolean
  /**
   * 请求前处理请求参数
   * @param params 请求参数
   */
  handleParams?: (...args: RequestFunctionParams) => any
  /**
   * 虚拟滚动
   * * 在条数不超过300的情况下，不建议使用，因为每次滚动时都会重新渲染表格，性能没有优势
   */
  virtual?: boolean
  /** 列配置 */
  columns?: UseTableColumnsType<T>[]
}

export type ColumnOptions = {
  [key: string]: {
    width?: number
  }
}
