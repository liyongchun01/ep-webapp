import React, { useState, useRef } from 'react'
import { Button, Popconfirm, Tag, Tooltip, DatePicker, Modal, Form, Input } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import DetailDrawer from '@/components/DetailDrawer';
import axios from 'axios';
import moment from 'moment';
import { tagObject, serviceTypeObject } from '../../configuration.js'
import { history } from 'umi';

const { RangePicker } = DatePicker

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

    //获取列表方法
    const fetchList = async (params, sort, filter) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.post(`http://localhost:8083/check/list`, {
            pno: params?.current,
            psize: params?.pageSize,
            type: filter.type ? +filter.type[0] : null,
            userId: uId.id,
            sortType: Object.values(sort)[0],
            sortField: Object.keys(sort)[0],
            btime: filter.insertTime && filter.hasOwnProperty("insertTime") ? moment(filter?.insertTime[0][0]).format('YYYY-MM-DD HH:mm') : null,
            etime: filter.insertTime && filter.hasOwnProperty("insertTime") ? moment(filter?.insertTime[0][1]).format('YYYY-MM-DD HH:mm') : null,
            id: params?.userType
        })
        setUserId(uId)

        return {
            data: list?.order,
            total: list?.count
        }
    }

    // 查看用户类型
    const userCheck = async () => {
        const { data } = await axios.get(`http://localhost:8083/check/userlist`)
        const formatList = [
            {
                label: '非爬取信息',
                value: 0
            },
            {
                label: '全部信息',
                value: -1
            }
        ].concat(data.map(({ nickname, id }) => ({
            label: nickname,
            value: id
        })))

        return formatList
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

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <>
                <RangePicker
                    onChange={e => setSelectedKeys(e ? [e] : [])}
                    showTime
                    format="YYYY/MM/DD HH:mm"
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex, clearFilters)}
                    icon={<SearchOutlined />}
                >
                    查询
                </Button>
            </>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, marginLeft: "20px" }} />,
    });

    const handleSearch = (selectedKeys, confirm, dataIndex, clearFilters) => {
        confirm()
        clearFilters()
    };

    const onFinish = async ({ reason }) => {
        setModalVisible(false)
        await axios.get(`http://localhost:8083/check/no`, {
            params: {
                type: rejectFields.type,
                typeId: rejectFields.typeId,
                orderId: rejectFields.orderId,
                handelRemark: reason
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
        await axios.get(`http://localhost:8083/check/ok`, {
            params: {
                type,
                typeId,
                orderId
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
            title: '用户类型',
            dataIndex: 'userType',
            hideInTable: true,
            valueType: 'select',
            request: async () => userCheck(),
            initialValue: 0
        },
        {
            title: '类型',
            dataIndex: 'type',
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
            sorter: true,
            key: 'insertTime',
            ...getColumnSearchProps('insertTime'),
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
                        驳回
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
                />
            </PageContainer>
            <Modal
                visible={modalVisible}
                width={700}
                destroyOnClose
                title="驳回"
                onOk={() => form.submit()}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                >
                    <Form.Item label="驳回原因" name="reason" rules={[{ required: true }]}>
                        <Input placeholder="请输入驳回原因" />
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
