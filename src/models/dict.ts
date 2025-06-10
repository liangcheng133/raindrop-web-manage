/*
 * @Date: 2025-04-17 17:28:21
 * @LastEditTime: 2025-06-10 15:51:38
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 系统通用字典
 */
export default () => {
  /** 枚举字典 */
  const Dicts = {
    /** 是否启禁用 */
    isActive: { 0: '启用', 1: '禁用' },
  }

  /** 表格枚举字典 */
  const ValueEnum = {
    /** 是否启禁用 */
    isActive: {
      0: { text: '启用', status: 'Success' },
      1: { text: '禁用', status: 'Error' }
    }
  }

  return { Dicts, ValueEnum }
}
