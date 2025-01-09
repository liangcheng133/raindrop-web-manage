import { request } from '@umijs/max'

export interface UseTableType {
  /** 接口地址 */
  api: string
}

export interface UseTableReturnType {
  tableProps: any
  tableDataSource: any[]
}

export default function useTable(options: UseTableType) {
  try {
    console.log('[ 调用useTable ] >')
    request(options.api, {
      method: 'post',
      data: { name: 1 }
    }).then((res) => {
      console.log('[ res ] >', res)
    })
  } catch (error) {
    console.log('[ error ] >', error)
  }
}
