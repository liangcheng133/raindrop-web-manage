import { getRsaPublicKey } from '@/services/user'
import JSEncrypt from 'jsencrypt'

/** 
 * 异步rsa加密
 * @param str 需要加密的字符串
 * @returns 返回加密后的字符串
 */
export function rsaEncrypt(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const jsencrypt = new JSEncrypt()
    //从后端接口获取publicKey
    getRsaPublicKey()
      .then((res) => {
        if (res.data) {
          jsencrypt.setPublicKey(res.data)
          let newStr = jsencrypt.encrypt(str)
          if (!newStr) {
            reject(new Error('加密失败'))
          }
          resolve(newStr as string)
        } else {
          reject(new Error('获取公钥失败'))
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
