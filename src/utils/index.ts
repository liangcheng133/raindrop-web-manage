import { FormInstance } from 'antd'
import { isNil, isPlainObject } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import z from 'zod'

/**
 * 将对象拼接到URL的查询字符串中
 * @param {String} url 基础URL
 * @param {Object} params 查询参数对象，属性值为空时不拼接
 * @returns 拼接后的完整URL
 */
export function appendQueryParams(url: string, params?: { [key: string]: string | number }) {
  if (!params || !isObject(params)) {
    return url
  }

  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key]
      if (value === null || value === undefined) {
        return ''
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')

  if (queryString) {
    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  return url
}

/**
 * 列表转树形
 * @param list 数据源
 * @param idField id字段
 * @param parentIdField parentId字段
 * @param topId 定点的id值
 * @param parentIds 父级id组
 * @returns
 */
export function listToTree<T extends { [key: string]: any }>(
  list: T[],
  idField?: string,
  parentIdField?: string,
  topId?: string,
  parentIds: string[] = []
): T[] {
  if (isNil(list) || list.length === 0) return []

  const pIdField = idField || 'id'
  const pParentIdField = parentIdField || 'parent_id'
  const topIdValue = topId ?? '0'

  // 构建映射表以提高查找效率
  const idMap = new Map<string, T>()
  list.forEach((item) => {
    if (!item[pIdField] || !item[pParentIdField]) {
      console.warn('Item missing required fields:', item)
      return
    }
    idMap.set(item[pIdField], item)
  })

  const data: T[] = []
  list.forEach((item) => {
    if (item[pParentIdField] === topIdValue) {
      const idArr = [...parentIds, item[pIdField]]
      const children = listToTree(Array.from(idMap.values()), pIdField, pParentIdField, item[pIdField], idArr)
      data.push({
        ...item,
        ...(children.length > 0 ? { children } : {})
      })
    }
  })

  return data
}

/**
 * 对象过滤空值
 * @param obj 需要过滤的obj
 * @returns
 */
export function objRemoveEmpty(obj: any) {
  for (const key in obj) {
    if (isNil(obj[key])) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 同步 模拟等待
 * @param ms 等待毫秒数
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * 根据键名或键名正则表达式获取对象中的值
 * @param obj 要查询的对象
 * @param key 键名字符串，可以是多级键名，用点号分隔
 * @param keyRegexp 可选的正则表达式，用于分割键名字符串，默认是点号
 * @returns 返回对象中与键名对应的值，如果找不到则返回空字符串
 */
export function getObjectValue(obj: any, key: string, keyRegexp?: RegExp) {
  if (obj && key) {
    const keys = key.split(`${keyRegexp || '.'}`)
    let value = obj
    for (let i = 0; i < keys.length; i++) {
      if (value && isPlainObject(value)) {
        value = value[keys[i]]
      }
    }
    return value
  }
  return ''
}

/**
 * 校验zod单个字段
 * @param schema - zod schema
 * @param field - 字段名
 * @param value - 字段值
 * @returns 错误信息，无错误时返回空字符串
 */
// export function validateZodField<TSchema extends z.AnyZodObject, TKey extends keyof z.infer<TSchema>>(
//   schema: TSchema,
//   field: TKey,
//   value: z.infer<TSchema>[TKey]
// ): string {
//   const fieldSchema = schema.pick({ [field]: true } as Record<string, true>)
//   const validResult = fieldSchema.safeParse({ [field]: value })
//   return validResult.success ? '' : validResult.error.issues[0].message
// }

/**
 * 将Zod验证错误信息发送到表单实例
 * 此函数的作用是将Zod库生成的验证错误信息映射到表单的相应字段中
 * 
 * @param error - Zod验证错误对象，包含了验证失败的字段路径和错误消息
 * @param form - 表单实例，通过该实例可以设置字段的错误信息
 */
export function zodErrorSendToForm(error: z.ZodError, form: FormInstance) {
  error.issues.forEach((issue) => {
    form.setFields([{ name: issue.path[0], errors: [issue.message] }])
  })
}
