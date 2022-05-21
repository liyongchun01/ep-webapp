import React, { useState, useRef } from 'react'
import { Button, Popconfirm, Tag, Tooltip, Modal, Form, Input } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import DetailDrawer from '@/components/DetailDrawer';
import axios from 'axios';
import { history } from 'umi';
import { tagObject, serviceTypeObject } from '../../configuration.js'

export default () => {
    const [userId, setUserId] = useState()
    const [detailVisible, setDetailVisible] = useState(false)
    const [recordList, setRecordList] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [rejectFields, setRejectFields] = useState()
    const [form] = Form.useForm()
    const formRef = useRef()

    const detailClick = (record) => {
        fetchDetail(record)
        setDetailVisible(true)
    }

    const dataSource = [
        {
            orderId: 1001,
            userId: 1231,
            typeId: 12,
            type: 1,
            status: 1,
            insertTime: "2022-1-12 12:21",
            handelRemark: "123"
        },
        {
            orderId: 1001,
            userId: 1231,
            typeId: 12,
            type: 1,
            status: 2,
            insertTime: "2022-1-12 12:21",
            handelRemark: "123"
        },
        {
            orderId: 1001,
            userId: 1231,
            typeId: 12,
            type: 1,
            status: 3,
            insertTime: "2022-1-12 12:21",
            handelRemark: "123"
        },
        {
            orderId: 1001,
            userId: 1231,
            typeId: 12,
            type: 1,
            status: 2,
            insertTime: "2022-1-12 12:21",
            handelRemark: "123"
        }
    ]

    //获取列表方法
    const fetchList = async (params, sort, filter) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.get(`http://localhost:8083/jiaruAndGuanzhu/list`, {
            params: {
                pno: params?.current,
                psize: params?.pageSize,
                type: filter.type ? +filter.type[0] : null,
                userId: uId.id,
                actType
            }
        })
        setUserId(uId)

        return {
            data: list?.jiaru,
            total: list?.count
        }
    }

    //查看订单详情
    const fetchDetail = async ({ type, typeId, orderId }) => {
        const { data } = await axios.get(`http://localhost:8083/upload/orderSee`, {
            params: {
                type: type,
                typeId: typeId,
                orderId: orderId
            }
        })
        if (type === 1) {
            setRecordList(data.heSuan)
        } else if (type === 2) {
            setRecordList(data.yiMiao)
        } else if (type === 3) {
            setRecordList(data.geli)
        } else {
            setRecordList(data)
        }
    }

    const onOk = () => {
        form.submit()
    }

    const onFinish = async ({ adminRemark }) => {
        setModalVisible(false)
        await axios.get(`http://localhost:8083/message/jiaruNo`, {
            params: {
                type: rejectFields.type,
                typeId: rejectFields.typeId,
                orderId: rejectFields.orderId,
                handelRemark: adminRemark
            }
        })
        formRef.current?.reload()
    }

    const setModal = (props) => {
        setRejectFields(props)
        setModalVisible(true)
    }

    // 通过方法
    const confirmData = async ({ type, typeId, orderId }) => {
        await axios.get(`http://localhost:8083/message/jiaruOk`, {
            params: {
                jiaruId: orderId,
                userId: userId.id,
            }
        })
        formRef.current?.reload()
    }

    // 跳转博客方法
    const toBlog = (record) => {
        history.push({
            pathname: '/blog',
            query: {
                type: record.type,
                orderId: record.orderId,
                typeId: record.typeId
            },
        });
    }

    const columns = [
        {
            title: '来源',
            dataIndex: "actType",
            hideInTable: true,
            valueType: 'select',
            request: async () => [
                {
                    label: '全部',
                    value: 0
                },
                {
                    label: '加入',
                    value: 1
                },
                {
                    label: '关注',
                    value: 2
                }
            ],
            initialValue: 0,
        },
        {
            title: '类型',
            dataIndex: 'actType',
            key: 'type',
            search: false,
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => toBlog(record)}>{serviceTypeObject[record?.type]}</Button>
                </>
            ),
            filters: [
                { text: '全部', value: 0 },
                { text: '核酸检测', value: 1 },
                { text: '疫苗接种', value: 2 },
                { text: '隔离地点', value: 3 },
                { text: '轨迹上传', value: 4 }
            ],
            defaultFilteredValue: `${[0]}`,
            filterMultiple: false
        },
        {
            title: '上传时间',
            dataIndex: 'insertTime',
            search: false,
            key: 'insertTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            search: false,
            width: 160,
            align: 'center',
            render: (_, record) => (
                <>
                    {
                        record.status === 3
                            ?
                            <Tooltip title={record.handelRemark}>
                                <Tag color={tagObject[record.status]?.color}>{tagObject[record.status]?.label}</Tag>
                            </Tooltip>
                            : <Tag color={tagObject[record.status]?.color}>{tagObject[record.status]?.label}</Tag>
                    }
                </>
            )
        },
        {
            title: '操作',
            width: 200,
            align: 'center',
            search: false,
            render: (_, record) => (
                <>
                    <Popconfirm
                        title="是否通过此条信息?"
                        onConfirm={() => confirmData(record)}
                    >
                        <Button type="link">
                            通过
                        </Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => setModal(record)}>
                        拒绝
                    </Button>
                    <Button type="link" onClick={() => detailClick(record)}>
                        详情
                    </Button>
                </>
            )
        }
    ]

    return (
        <>
            <PageContainer>
                <ProTable
                    columns={columns}
                    actionRef={formRef}
                    request={fetchList}
                    dataSource={dataSource}
                // search={false}
                />
            </PageContainer>
            <Modal
                visible={modalVisible}
                width={700}
                destroyOnClose
                title="驳回"
                onOk={onOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                >
                    <Form.Item label="拒绝原因" name="adminRemark" rules={[{ required: true }]}>
                        <Input placeholder="请输入拒绝原因" />
                    </Form.Item>
                </Form>
            </Modal>
            <DetailDrawer
                detailVisible={detailVisible}
                recordList={recordList}
                setDetailVisible={setDetailVisible}
                userId={userId}
                fetchDetail={fetchDetail}
                isManagement={true}
            />
        </>
    );
};
