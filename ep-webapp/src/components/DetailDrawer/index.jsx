import React, { useRef } from 'react'
import ProDescriptions from '@ant-design/pro-descriptions';
import { Tag, Drawer, Timeline } from "antd";
import CreateInfoForm from '@/pages/UploadInfo/component/CreateInfoForm';
import { serviceTypeObject, tagObject } from '@/configuration';
import styles from './styles.less'

export default ({ detailVisible, recordList, setDetailVisible, userId, anyId, fetchDetail, isManagement }) => {
    const formRef = useRef()

    return (
        <>
            <Drawer
                placement="right"
                onClose={() => setDetailVisible(false)}
                visible={detailVisible}
                maskStyle={{ background: "rgba(0,0,0,0.3)" }}
                size="large"
                actionRef={formRef}
            >
                {
                    <ProDescriptions column={2} title="详情信息" >
                        <ProDescriptions.Item label="文本" valueType="option">
                            {!isManagement && <CreateInfoForm options="modified" setDetailVisible={setDetailVisible} userId={userId} modifyField={recordList} formRef={formRef} anyId={anyId} fetchDetail={fetchDetail} />}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item span={2} label="上传类型">{serviceTypeObject[recordList?.type]}</ProDescriptions.Item>
                        {
                            recordList?.type === 1 &&
                            <>
                                <ProDescriptions.Item label="场所名称" >
                                    {recordList.hesuanName}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="检测地点" >
                                    {recordList.hesuanPosition}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="开始时间" >
                                    {`${recordList.startdate} ${recordList.starttime}`}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="结束时间" >
                                    {`${recordList.enddate} ${recordList.endtime}`}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="当前人数" >
                                    {recordList.renshu}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={recordList?.status === 3 ? 1 : 2} label="审核状态" >
                                    <Tag color={tagObject[recordList?.status]?.color}>{tagObject[recordList?.status]?.label}</Tag>
                                </ProDescriptions.Item>
                            </>
                        }
                        {
                            recordList?.type === 2 &&
                            <>
                                <ProDescriptions.Item span={2} label="疫苗名称" >
                                    {recordList.yimaioName}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="接种地点" >
                                    {recordList.yimiaoPosition}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="所属机构" >
                                    {recordList.orgType}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="接种批次" span={2}>
                                    {recordList.batch}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={2} label="等待人数" >
                                    {recordList.renshu}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="开始时间" >
                                    {`${recordList.startdate} ${recordList.starttime}`}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={2} label="结束时间" >
                                    {`${recordList.enddate} ${recordList.endtime}`}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={recordList?.status === 3 ? 1 : 2} label="审核状态" >
                                    <Tag color={tagObject[recordList?.status]?.color}>{tagObject[recordList.status]?.label}</Tag>
                                </ProDescriptions.Item>
                            </>
                        }
                        {
                            recordList?.type === 3 &&
                            <>
                                <ProDescriptions.Item label="场所名称" >
                                    {recordList.gelidianName}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="所属机构" >
                                    {recordList.geliOrg}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="隔离地点" >
                                    {recordList.gelidianPosition}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={2} label="联系电话" >
                                    {recordList.contact}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={2} label="隔离人数" >
                                    {recordList.grlirenshu}
                                </ProDescriptions.Item>

                                <ProDescriptions.Item span={2} label="结束时间" >
                                    {`${recordList.enddate}`}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item span={recordList?.status === 3 ? 1 : 2} label="审核状态" >
                                    <Tag color={tagObject[recordList?.status]?.color}>{tagObject[recordList?.status]?.label}</Tag>
                                </ProDescriptions.Item>
                            </>
                        }
                        {
                            +recordList?.type === 4 &&
                            <>
                                <ProDescriptions.Item span={2}>
                                    <Timeline className={styles.timeLineStyle}>
                                        {
                                            recordList?.guiji?.map(item => (
                                                <Timeline.Item>{`${item.starttime} ${item.endtime} ${item.guijiPosition}`}</Timeline.Item>
                                            ))
                                        }
                                    </Timeline>
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="审核状态" >
                                    <Tag color={tagObject[recordList?.status]?.color}>{tagObject[recordList?.status]?.label}</Tag>
                                </ProDescriptions.Item>
                            </>
                        }
                        {
                            recordList?.status === 3 &&
                            <ProDescriptions.Item label="驳回原因" >
                                {recordList?.handelRemark}
                            </ProDescriptions.Item>
                        }
                        {
                            recordList?.status !== 1 &&
                            <ProDescriptions.Item span={2} label="处理时间" >
                                {recordList?.processTime}
                            </ProDescriptions.Item>
                        }

                        <ProDescriptions.Item span={2} label="上传时间" >
                            {recordList?.uploadTime}
                        </ProDescriptions.Item>
                    </ProDescriptions>
                }
            </Drawer>
        </>
    )
}