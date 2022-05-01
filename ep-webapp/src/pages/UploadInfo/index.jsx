import React, { useEffect, useRef, useState } from 'react'
import { Button, Popconfirm, Tag, Drawer, Tooltip, Timeline, message, Select, DatePicker } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import styles from './styles.less'
import CreateInfoForm from './component/CreateInfoForm';
import ProDescriptions from '@ant-design/pro-descriptions';
import axios from 'axios';
import { tagObject, serviceTypeObject, globalOptions } from '../../configuration.js'
import moment from 'moment';
const { RangePicker } = DatePicker

export default () => {
    const [userId, setUserId] = useState()
    const [detailVisible, setDetailVisible] = useState(false)
    const [recordList, setRecordList] = useState({})
    const [anyId, setAnyId] = useState({})
    const formRef = useRef()
    const onClose = () => {
        setDetailVisible(false);
    };

    const detailClick = (record) => {
        console.log(record)
        fetchDetail(record)
        setDetailVisible(true)
        setAnyId(record)
    }

    const detailDrawer = () => {
        return (
            <>
                <Drawer
                    placement="right"
                    onClose={onClose}
                    visible={detailVisible}
                    maskStyle={{ background: "rgba(0,0,0,0.3)" }}
                    size="large"
                    actionRef={formRef}
                >
                    {
                        <ProDescriptions column={2} title="详情信息" >
                            <ProDescriptions.Item label="文本" valueType="option">
                                <CreateInfoForm options="modified" setDetailVisible={setDetailVisible} userId={userId} modifyField={recordList} formRef={formRef} anyId={anyId} fetchDetail={fetchDetail} />
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
        await axios.get(`http://localhost:8083/upload/delect`, {
            params: {
                type: type,
                typeId: typeId,
                orderId: orderId
            }
        }).then(({ data }) => {
            console.log(data)
            if (data.msg !== "删除成功") {
                message.error(data.msg)

            }
            message.success(data.msg)
        }).catch((err) => {
            console.log(err)
        })
        formRef.current?.reload()
    }

    //查看订单详情
    const fetchDetail = async ({ type, typeId, orderId }) => {
        await axios.get(`http://localhost:8083/upload/orderSee`, {
            params: {
                type: type,
                typeId: typeId,
                orderId: orderId
            }
        }).then(({ data }) => {
            // console.log(data)
            if (type === 1) {
                setRecordList(data.heSuan)
            } else if (type === 2) {
                setRecordList(data.yiMiao)
            } else if (type === 3) {
                setRecordList(data.geli)
            } else {
                setRecordList(data)
            }
        }).catch((err) => {
            console.log(err)
        })
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
                            {/* <Select style={{ width: "100px" }} options={globalOptions} defaultValue={selectKey} onChange={onValueChange} /> */}
                            <CreateInfoForm options="create" setDetailVisible={setDetailVisible} userId={userId} formRef={formRef} anyId={anyId} fetchDetail={fetchDetail} />
                        </>
                    ]}
                />
            </PageContainer>
            {
                detailDrawer()
            }
        </>
    );
};
