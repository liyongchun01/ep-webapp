import React, { useRef, useState } from 'react'
import { Button, Popconfirm, Tag, Tooltip, message, DatePicker } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import styles from './styles.less'
import CreateInfoForm from './component/CreateInfoForm';
import DetailDrawer from '@/components/DetailDrawer';
import axios from 'axios';
import { tagObject, serviceTypeObject } from '@/configuration'
import moment from 'moment';
const { RangePicker } = DatePicker

export default () => {
    const [userId, setUserId] = useState()
    const [detailVisible, setDetailVisible] = useState(false)
    const [recordList, setRecordList] = useState({})
    const [anyId, setAnyId] = useState({})
    const formRef = useRef()

    const detailClick = (record) => {
        fetchDetail(record)
        setDetailVisible(true)
        setAnyId(record)
    }

    //获取列表方法
    const fetchList = async (params, sort, filter) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.post(`http://localhost:8083/upload/list`, {
            pno: params?.current,
            psize: params?.pageSize,
            type: filter.type ? +filter.type[0] : null,
            userId: uId.id,
            sortType: Object.values(sort)[0],
            sortField: Object.keys(sort)[0],
            btime: filter.insertTime && filter.hasOwnProperty("insertTime") ? moment(filter?.insertTime[0][0]).format('YYYY-MM-DD HH:mm') : null,
            etime: filter.insertTime && filter.hasOwnProperty("insertTime") ? moment(filter?.insertTime[0][1]).format('YYYY-MM-DD HH:mm') : null,
        })
        setUserId(uId)

        return {
            data: list?.order,
            total: list?.count
        }
    }

    //删除方法
    const deleteData = async ({ type, typeId, orderId }) => {
        const { data } = await axios.get(`http://localhost:8083/upload/delect`, {
            params: {
                type: type,
                typeId: typeId,
                orderId: orderId
            }
        })
        if (data.msg !== "删除成功") {
            message.error(data.msg)

        }
        message.success(data.msg)
        formRef.current?.reload()
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

    const columns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (
                <>
                    {serviceTypeObject[record?.type]}
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
            sorter: true,
            key: 'insertTime',
            ...getColumnSearchProps('insertTime'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
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
            key: 'options',
            width: 160,
            align: 'center',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => detailClick(record)}>
                        详情
                    </Button>
                    <Popconfirm
                        title="是否删除此条信息?"
                        onConfirm={() => deleteData(record)}
                    >
                        <Button type="link">
                            删除
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    return (
        <>
            <PageContainer>
                <ProTable
                    className={styles.tableContainer}
                    columns={columns}
                    // dataSource={dataSource}
                    request={fetchList}
                    search={false}
                    actionRef={formRef}
                    toolBarRender={() => [
                        <>
                            <CreateInfoForm options="create" setDetailVisible={setDetailVisible} userId={userId} formRef={formRef} anyId={anyId} fetchDetail={fetchDetail} />
                        </>
                    ]}
                />
            </PageContainer>
            <DetailDrawer
                detailVisible={detailVisible}
                recordList={recordList}
                setDetailVisible={setDetailVisible}
                userId={userId}
                anyId={anyId}
                fetchDetail={fetchDetail}
                isManagement={false}
            />
        </>
    );
};
