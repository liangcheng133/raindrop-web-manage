import z from 'zod'

/**
 * 校验zod单个字段
 * @param schema - zod schema
 * @param field - 字段名
 * @param value - 字段值
 * @returns 错误信息，无错误时返回空字符串
 */
export function validateZodField<TSchema extends z.AnyZodObject, TKey extends keyof z.infer<TSchema>>(
  schema: TSchema,
  field: TKey,
  value: z.infer<TSchema>[TKey]
): string {
  const fieldSchema = schema.pick({ [field]: true } as Record<string, true>)
  const validResult = fieldSchema.safeParse({ [field]: value })
  return validResult.success ? '' : validResult.error.issues[0].message
}
