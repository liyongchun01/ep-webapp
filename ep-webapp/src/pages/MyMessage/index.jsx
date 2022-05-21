import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Form } from 'antd';
import ProList from '@ant-design/pro-list';
import { PageContainer } from '@ant-design/pro-layout';
import { messageTab, messageTabObj, serviceTypeObject, readObj } from '@/configuration';
import axios from 'axios';
import styles from './styles.less';
import Modal from 'antd/lib/modal/Modal';
import { history } from 'umi';

const dataSource = [
    {
        name: '语雀的天空',
        content: '说的好',
        type: 1,
        parentRead: 0,
        typeName: "黑龙江工程学院",
        messageType: 0,
        jiaruId: 1,
        orderId: 1001,
        userRemark: 1001
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
    const formRef = useRef()
    const [form] = Form.useForm()
    const [key, setKey] = useState("1")
    const [userId, setuserId] = useState()
    const [rejectFields, setRejectFields] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const getMessageList = async (params) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        setuserId(uId)
        if (key == 4) {
            const { data: guanzhu } = await axios.get(`http://localhost:8083/jiaruAndGuanzhu/list`, {
                params: {
                    userId: uId?.id,
                    pno: params?.current,
                    psize: params?.pageSize,
                    type: params?.type,
                    messageType: 2
                }
            })
            return {
                data: guanzhu?.guanzhu,
                total: guanzhu?.count
            }
        } else if (key == 5) {
            const { data: jiaru } = await axios.get(`http://localhost:8083/jiaruAndGuanzhu/list`, {
                params: {
                    userId: uId?.id,
                    pno: params?.current,
                    psize: params?.pageSize,
                    type: params?.type,
                    messageType: 1
                }
            })

            return {
                data: jiaru?.jiaru,
                total: jiaru?.count
            }
        } else {
            const { data: list } = await axios.get(`http://localhost:8083/message/list`, {
                params: {
                    userId: uId?.id,
                    pno: params?.current,
                    psize: params?.pageSize,
                    type: params?.type,
                    parentRead: params?.parentRead,
                    messageType: key
                }
            })

            return {
                data: list?.comment,
                total: list?.count
            }
        }
    }

    useEffect(() => {
        formRef.current?.reload()
    }, [key])

    // 通过方法
    const handleAccess = async (reocrd) => {
        await axios.get(`http://localhost:8083/message/jiaruOk`, {
            params: {
                jiaruId: reocrd.jiaruId,
                userId: userId.id
            }
        })
    }

    // 拒绝方法
    const handleRefuse = async (record) => {
        setRejectFields(record)
        setModalVisible(true)
    }

    // 已读方法
    const handleRead = async () => {
        await axios.get(`http://localhost:8083/message/read`, {
            params: {
                messageType,
                commentId,
                jiaruId,
                userId: userId.id
            }
        })
    }

    // 提交表单
    const onFinish = async ({ adminRemark }) => {
        setModalVisible(false)
        await axios.get(`http://localhost:8083/message/jiaruNo`, {
            params: {
                jiaruId: rejectFields.jiaruId,
                userId: userId?.id,
                adminRemark
            }
        })
    }

    // 跳转博客
    const toBlog = (record) => {
        history.push({
            pathname: '/blog',
            query: {
                type: record.type,
                orderId: record.orderId,
                typeId: +record.userRemark
            },
        });
    }

    const metas = {
        title: {
            dataIndex: 'name',
            search: false,
            render: (_, record) => (
                <>
                    <div onClick={() => toBlog(record)}>
                        <span style={{ "fontSize": "16px", "fontWeight": "600" }}>{record.name}</span>
                        <span> 于{serviceTypeObject[record.type]}: 「{record.typeName}」回复了你: </span>
                        <span style={{ "color": "rgba(0, 0, 0, 0.45)", "fontSize": "12px", "marginLeft": "10px" }}>{readObj[record.parentRead]}</span>
                    </div>
                </>
            )
        },
        subTitle: {
            title: "类型",
            dataIndex: 'type',
            valueType: 'select',
            initialValue: 0,
            request: async () => [
                {
                    label: '全部',
                    value: 0
                },
                {
                    label: '核酸检测',
                    value: 1
                },
                {
                    label: '疫苗接种',
                    value: 2
                },
                {
                    label: '隔离地点',
                    value: 3
                },
                {
                    label: '轨迹信息',
                    value: 4
                }
            ],
            render: () => (
                <>

                </>
            )
        },
        description: {
            dataIndex: 'content',
            search: false
        },
        actions: {
            search: false,
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => handleAccess(record)}>通过</Button>
                    <Button type='link' onClick={() => handleRefuse(record, "reject")}>拒绝</Button>
                    <Button type='link' onClick={() => handleRead(record)}>已读</Button>
                    <Button type='link' onClick={() => handleRefuse(record, "commet")}>回复</Button>
                </>

            ),
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
    }

    return (
        <>
            <PageContainer
                header={{
                    title: ""
                }}
                tabList={messageTab}
                onTabChange={(key) => setKey(key)}
            >
                <ProList
                    actionRef={formRef}
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
                    metas={metas}
                />
            </PageContainer>
            <Modal
                title="拒绝"
                visible={modalVisible}
                destroyOnClose
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="确定"
                cancelText="取消"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                >
                    <Form.Item name="adminRemark" label="拒绝理由">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}