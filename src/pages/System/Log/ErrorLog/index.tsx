import { AuthButtons } from '@/components'
import { useTable } from '@/hooks'
import { queryTrackListAPI } from '@/services/track'
import { TrackVO } from '@/types/api'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/date'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { unzipRecordscreen } from '@web-tracing/core'
import { useBoolean } from 'ahooks'
import { Button, Modal, Tag } from 'antd'
import React from 'react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import styles from './index.less'

const cx = classNameBind(styles)

const ErrorLogList: React.FC<React.PropsWithChildren> = (props) => {
  const { ValueEnum, Dicts } = useModel('dict')
  const [errModalVisible, { setTrue: openErrModal, setFalse: closeErrModal }] = useBoolean(false)

  // 查看回放
  const viewReplay = (record: TrackVO) => {
    if (!record.record_screen) {
      antdUtil.message?.error('该异常没有回放录制')
      return
    }
    openErrModal()
    setTimeout(() => {
      const dom = document.getElementById('recordScreen')
      if (!dom) return
      const recordscreen = unzipRecordscreen(record.record_screen)
      new rrwebPlayer({
        target: dom,
        props: {
          width: 1000,
          events: recordscreen as any,
          UNSAFE_replayCanvas: true
        }
      })
    }, 300)
  }

  const { config: tableProps } = useTable<TrackVO, any>({
    api: queryTrackListAPI,
    persistenceColumnsKey: 'sys.track.index',
    columns: [
      { title: '应用名称', dataIndex: 'app_name', width: 140 },
      {
        title: '事件类型',
        dataIndex: 'event_type',
        width: 100,
        render: (text, record) => <Tag color='error'>{record.event_type}</Tag>
      },
      { title: '事件来源', dataIndex: 'event_source', width: 120 },
      { title: '信息', dataIndex: 'message', width: 200, valueType: 'code' },
      { title: '位置URL', dataIndex: 'url', width: 200 },
      { title: 'IP地址', dataIndex: 'ip_address', width: 140 },
      { title: '设备/平台', dataIndex: 'device', width: 100 },
      { title: '浏览器', dataIndex: 'browser', width: 100 },
      { title: '发生时间', dataIndex: 'send_time', width: 170 },
      {
        title: '发生时间',
        dataIndex: 'send_time_range',
        width: 170,
        valueType: 'dateTimeRange',
        hideInTable: true,
        initialValue: [getFirstDayOfMonth(), getLastDayOfMonth()],
        search: {
          transform: (value) => {
            return {
              start_send_time: value[0],
              end_send_time: value[1]
            }
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'option',
        width: 80,
        fixed: 'right',
        render: (_, record) => {
          return (
            <AuthButtons
              items={[
                {
                  title: '查看回放',
                  type: 'link',
                  hide: !record.record_screen,
                  onClick: () => {
                    viewReplay(record)
                  }
                }
              ]}
            />
          )
        }
      }
    ]
  })
  return (
    <PageContainer ghost className={cx('list-container')}>
      <ProTable {...tableProps} />
      <Modal
        title='错误回放'
        width={1050}
        open={errModalVisible}
        onCancel={closeErrModal}
        destroyOnClose
        footer={[
          <Button key='close' onClick={closeErrModal}>
            关闭
          </Button>
        ]}>
        <div id='recordScreen'></div>
      </Modal>
    </PageContainer>
  )
}

export default ErrorLogList
