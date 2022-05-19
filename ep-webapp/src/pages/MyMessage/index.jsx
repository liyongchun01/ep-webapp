import React, { useState } from 'react';
import { Button, Tag, Space } from 'antd';
import ProList from '@ant-design/pro-list';
import { PageContainer } from '@ant-design/pro-layout';
import { MessageOutlined } from '@ant-design/icons';
import { messageTab, messageTabObj, serviceTypeObject, readObj } from '@/configuration';
import axios from 'axios';
import styles from './styles.less';

const dataSource = [
    {
        name: '语雀的天空',
        content: '说的好',
        type: 1,
        parentRead: 0,
        typeName: "黑龙江工程学院",
        messageType: 0,
    },
    {
        name: 'Ant Design',
        content: '啥时候结束啊',
        type: 2,
        parentRead: 1,
        typeName: "黑龙江工程学院",
        messageType: 1,
    },
    {
        name: '蚂蚁金服体验科技',
        content: '人多吗现在',
        type: 3,
        parentRead: 0,
        typeName: "黑龙江工程学院",
        messageType: 2,
    },
    {
        name: 'TechUI',
        content: '下雨了！',
        type: 4,
        parentRead: 1,
        typeName: "黑龙江工程学院",
        messageType: 1,
    },
];

export default () => {
    const [key, setKey] = useState("-1")
    console.log(key)
    const [filterType, setFilterType] = useState(0)

    const getMessageList = async (params) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.get(`http://localhost:8083/message/list`, {
            params: {
                userId: uId?.id,
                pno: params?.current,
                psize: params?.pageSize,
                type: +params?.type,
                parentRead: params?.parentRead,
                messageType: key
            }
        })

        setFilterType(params.type)

        return {
            data: list?.comment,
            total: list?.count
        }
    }

    return (
        <PageContainer
            header={{
                title: ""
            }}
            tabList={messageTab}
            onTabChange={(key) => setKey(key)}
        >
            <ProList
                className={styles.listStyle}
                search={{}}
                pagination={{
                    pageSize: 5,
                }}
                rowKey="name"
                headerTitle={messageTabObj[key]}
                dataSource={dataSource}
                request={getMessageList}
                showActions="hover"
                showExtra="hover"
                metas={{
                    title: {
                        dataIndex: 'name',
                        search: false,
                        render: (_, record) => (
                            <>
                                <span style={{ "fontSize": "16px", "fontWeight": "600" }}>{record.name}</span>
                                <span> 于{serviceTypeObject[record.type]}: 「{record.typeName}」回复了你: </span>
                                <span style={{ "color": "rgba(0, 0, 0, 0.45)", "fontSize": "12px", "marginLeft": "10px" }}>{readObj[record.parentRead]}</span>
                            </>
                        )
                    },
                    subTitle: {
                        title: "类型",
                        dataIndex: 'type',
                        render: (_, record) => {
                            if (key == -1) {
                                return (
                                    <Space size={0}>
                                        <Tag color="blue">
                                            {messageTabObj[record.messageType]}
                                        </Tag>
                                    </Space>
                                );
                            }
                        },
                        valueType: 'select',
                        initialValue: "0",
                        valueEnum: {
                            0: {
                                text: '全部',
                                status: 'Default'
                            },
                            1: {
                                text: '核酸检测',
                                status: 'Default'
                            },
                            2: {
                                text: '疫苗接种',
                                status: 'Error',
                            },
                            3: {
                                text: '隔离地点',
                                status: 'Success',
                            },
                            4: {
                                text: '轨迹信息',
                                status: 'Processing',
                            },
                        },
                    },
                    description: {
                        dataIndex: 'content',
                        search: false
                    },
                    actions: {
                        search: false,
                        render: (_, record) => [
                            <MessageOutlined />
                        ],
                    },
                    status: {
                        title: "状态",
                        dataIndex: 'parentRead',
                        valueType: 'select',
                        initialValue: "-1",
                        valueEnum: {
                            "-1": {
                                text: '全部',
                                status: 'Default'
                            },
                            "0": {
                                text: '未读',
                                status: 'Default'
                            },
                            "1": {
                                text: '已读',
                                status: 'Error',
                            },
                        },
                    },
                }}
            />
        </PageContainer>
    )
}