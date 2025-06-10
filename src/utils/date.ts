/*
 * @Date: 2025-01-24 11:11:00
 * @LastEditTime: 2025-01-24 11:15:44
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 日期类
 */

import dayjs from 'dayjs'

/** 通用日期格式 */
export const DATE_FORMATS = {
  1: 'YYYY-MM-DD HH:mm:ss',
  2: 'YYYY-MM-DD',
  3: 'YYYY-MM-DD HH:mm',
  4: 'HH:mm:ss',
  5: 'HH:mm'
}

/**
 * 格式化日期
 * @param {Date | string | number} val 时间
 * @param {string} formatStr 日期格式
 * @return {string}
 */
export function format(val: Date | string | number | dayjs.Dayjs, formatStr?: string): string {
  const time = dayjs(val)
  const f = formatStr || DATE_FORMATS[1]
  return time.format(f)
}

/**
 * 获取当前日期字符串
 * @param {string} formatStr 日期格式
 * @return {string}
 */
export function getCurrentTime(formatStr?: string): string {
  return format(dayjs(), formatStr)
}

/**
 * 获取本月的第一天
 * @param {string} formatStr 日期格式
 * @return {string}
 */
export function getFirstDayOfMonth(formatStr?: string): string {
  return format(dayjs().startOf('month'), formatStr)
}

/**
 * 获取本月的最后一天
 * @param {string} formatStr 日期格式
 * @return {string}
 */
export function getLastDayOfMonth(formatStr?: string): string {
  return format(dayjs().endOf('month'), formatStr)
}
