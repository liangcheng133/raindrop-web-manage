import dayjs from 'dayjs';
import { isJSONString } from './validate';

/**
 * 设置本地缓存
 * @param {string} key 主键
 * @param {any} value 任意值
 * @param {number} time 分钟
 * @param {boolean} isJson 是否保存为JSON字符串
 */
export function setLocal(key: string, value: any, time: number = 0, isJson: boolean = true): void {
  const data = {
    value,
    time: null as any
  };
  if (!isJson) {
    localStorage.setItem(key, value);
  } else {
    if (time > 0) {
      data.time = dayjs().add(time, 'm').valueOf();
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
}

/**
 * 获取本地缓存数据
 * @param {string} key 主键
 * @returns {any | null}
 */
export function getLocal(key: string): any | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  if (!isJSONString(data)) return data;
  const dataObj = JSON.parse(data);
  if (dataObj.time && dataObj.time < dayjs().valueOf()) {
    removeLocal(key);
    return null;
  }
  return dataObj.value;
}

/**
 * 删除本地缓存数据
 * @param {string | string[]} key 主键
 */
export function removeLocal(key: string | string[]): void {
  if (Array.isArray(key)) {
    key.forEach((item) => {
      localStorage.removeItem(item);
    });
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * 清空所有本地缓存
 */
export function clearLocal(): void {
  localStorage.clear();
}