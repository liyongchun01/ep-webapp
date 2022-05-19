import React from 'react'
import { callbackFieldsKeys, serviceTypeObject } from "@/configuration";
import ProDescriptions from "@ant-design/pro-descriptions";
import { Timeline, Collapse } from 'antd';
import styles from './styles.less'

const { Panel } = Collapse;
export default ({ blogInfo }) => {
    const behaviourArr = Object.entries(blogInfo.qiekai)

    return (
        <ProDescriptions column={3} title="详情信息" style={{ "marginLeft": "5px" }} bordered className={styles.descriptionStyle}>
            {
                blogInfo?.type === 1 &&
                <>
                    <ProDescriptions.Item span={1} label="场所名称" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].hesuanName}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="检测地点" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].hesuanPosition}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={1} label="开始时间" >
                        {`${blogInfo[callbackFieldsKeys[blogInfo.type]].startdate} ${blogInfo[callbackFieldsKeys[blogInfo.type]].starttime}`}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="结束时间" >
                        {`${blogInfo[callbackFieldsKeys[blogInfo.type]].enddate} ${blogInfo[callbackFieldsKeys[blogInfo.type]].endtime}`}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={3} label="当前人数" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].renshu}
                    </ProDescriptions.Item>
                </>
            }
            {
                blogInfo?.type === 2 &&
                <>
                    <ProDescriptions.Item span={2} label="疫苗名称" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].yimaioName}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="接种地点" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].yimiaoPosition}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="所属机构" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].orgType}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="接种批次" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].batch}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="等待人数" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].renshu}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="开始时间" >
                        {`${blogInfo[callbackFieldsKeys[blogInfo.type]].startdate} ${blogInfo[callbackFieldsKeys[blogInfo.type]].starttime}`}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={3} label="结束时间" >
                        {`${blogInfo[callbackFieldsKeys[blogInfo.type]].enddate} ${blogInfo[callbackFieldsKeys[blogInfo.type]].endtime}`}
                    </ProDescriptions.Item>
                </>
            }
            {
                blogInfo?.type === 3 &&
                <>
                    <ProDescriptions.Item span={2} label="场所名称" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].gelidianName}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="所属机构" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].geliOrg}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="隔离地点" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].gelidianPosition}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="联系电话" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].contact}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item span={2} label="隔离人数" >
                        {blogInfo[callbackFieldsKeys[blogInfo.type]].grlirenshu}
                    </ProDescriptions.Item>

                    <ProDescriptions.Item label="结束时间" >
                        {`${blogInfo[callbackFieldsKeys[blogInfo.type]].enddate}`}
                    </ProDescriptions.Item>
                </>
            }
            {
                +blogInfo?.type === 4 &&
                <>
                    <ProDescriptions.Item label="轨迹信息" span={3}>
                        <Collapse defaultActiveKey={['1']} ghost>
                            <Panel header="详情" key="1">
                                <Timeline mode="alternate">
                                    {
                                        blogInfo[callbackFieldsKeys[blogInfo.type]]?.map(item => (
                                            <Timeline.Item>{`${item.starttime} ${item.endtime} ${item.guijiPosition}`}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
                            </Panel>
                        </Collapse>
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="行为信息" span={3}>
                        <Collapse defaultActiveKey={['1']} ghost>
                            <Panel header="详情" key="2">
                                <Timeline mode="alternate">
                                    {
                                        behaviourArr.map(item => (
                                            <Timeline.Item>{`${item[1]} ${item[0]}`}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
                            </Panel>
                        </Collapse>

                    </ProDescriptions.Item>
                </>
            }
            {
                <ProDescriptions.Item span={3} label="处理时间" >
                    {blogInfo[callbackFieldsKeys[blogInfo.type]]?.processTime}
                </ProDescriptions.Item>
            }

            <ProDescriptions.Item label="上传时间" >
                {blogInfo[callbackFieldsKeys[blogInfo.type]]?.uploadTime}
            </ProDescriptions.Item>
        </ProDescriptions>
    )
}