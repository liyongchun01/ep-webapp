import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import ProList from '@ant-design/pro-list';
import { PageContainer } from '@ant-design/pro-layout';
import {
    messageTab,
    messageTabObj,
    serviceTypeObject,
    readObj,
    callbackFieldsKeys,
    callbackFieldsPositionKeys,
    listObj
} from '@/configuration';
import axios from 'axios';
import styles from './styles.less';
import { history } from 'umi';
import moment from 'moment';
import SubmitModal from './component/SubmitModal';
import DetailDrawer from '@/components/DetailDrawer';

export default () => {
    const formRef = useRef()
    const [key, setKey] = useState("1")
    const [userId, setuserId] = useState({ id: 1001, nickname: "1zsvd" })
    const [guanzhuFields, setGuanzhuFields] = useState()
    const [followOrJoin, setFollowOrJoin] = useState(1)
    const [detailVisible, setDetailVisible] = useState(false)
    const [recordList, setRecordList] = useState({})
    const [anyId, setAnyId] = useState({})
    const timestamp = moment(new Date()).valueOf();
    const createTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

    const getMessageList = async (params) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        setuserId(uId)
        setFollowOrJoin(params?.shenQingType)
        if (key == 4 || key == 5) {
            const { data: joinOrFollow } = await axios.get(`http://localhost:8083/jiaruAndGuanzhu/list`, {
                params: {
                    userId: uId?.id,
                    pno: params?.current,
                    psize: params?.pageSize,
                    type: params?.type,
                    messageType: key == 4 ? 1 : 2
                }
            })
            setGuanzhuFields(joinOrFollow[listObj[key]])

            return {
                data: joinOrFollow[listObj[key]],
                total: joinOrFollow?.count
            }
        } else {
            const { data: list } = await axios.get(`http://localhost:8083/message/list`, {
                params: {
                    userId: uId?.id,
                    pno: params?.current,
                    psize: params?.pageSize,
                    type: params?.type,
                    parentRead: params?.parentRead,
                    messageType: key,
                    shenQingType: key === "3" ? (params?.hasOwnProperty("shenQingType") ? params?.shenQingType : 1) : null
                }
            })

            return {
                data: list[listObj[key]],
                total: list?.count
            }
        }
    }

    useEffect(() => {
        formRef.current?.reload()
    }, [key])

    const btnObj = (key, followOrJoin, record) => {
        if (key != "3") {
            const normalObj = {
                "0": <>
                    <Button type='link' onClick={() => handleRead(record)}>已读</Button>
                </>,
                "1": <>
                    <Button type='link' onClick={() => handleRead(record)}>已读</Button>
                    <SubmitModal options="reply" userId={userId} record={record} createTime={createTime} />
                </>,
                "2": <>
                    <Button type='link' onClick={() => handleRead(record)}>已读</Button>
                    <SubmitModal options="reply" userId={userId} record={record} createTime={createTime} />
                </>
            }
            return normalObj[key]
        } else {
            const complexBtn = {
                1: <>
                    <Button type='link' style={{ "color": "red" }} onClick={() => removeFollow(record)}>移除</Button>
                </>,
                2: <>
                    <Button type='link' onClick={() => handleRead(record)}>已读</Button>
                    <SubmitModal options="refuse" userId={userId} record={record} createTime={createTime} />
                </>
            }
            return complexBtn[followOrJoin]
        }

    }

    const detailClick = (record) => {

    }

    // 获取详情信息
    const getDetail = async (record) => {
        fetchDetail(record)
        setDetailVisible(true)
        setAnyId(record)
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

    // 通过方法
    const handleAccess = async (reocrd) => {
        await axios.get(`http://localhost:8083/message/jiaruOk`, {
            params: {
                jiaruId: reocrd.jiaruId,
                userId: userId.id
            }
        })
    }

    // 已读方法
    const handleRead = async (record) => {
        await axios.get(`http://localhost:8083/message/read`, {
            params: {
                messageType: key,
                commentId: record.commentId,
                jiaruId: record.jiaruId,
                userId: userId.id
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

    // 取消关注
    const removeFollow = async ({ orderId, type, typeId }) => {
        await axios.post(`http://localhost:8083/boke/guanzhu`, {
            userId: userId?.id,
            orderId,
            type,
            typeId,
            createTime,
            typeName: guanzhuFields[callbackFieldsKeys[guanzhuFields?.type]][callbackFieldsPositionKeys[guanzhuFields?.type]],
            guanzhu: 0
        })
        formRef.current?.reload()
    }

    const joinMetas = {
        title: {
            dataIndex: 'status',
            render: (_, record) => (
                <>
                    <Button style={{ "paddingLeft": 0 }} type='link' onClick={() => toBlog(record)}>{serviceTypeObject[record?.type]}</Button>
                </>
            ),
        },
        description: {
            dataIndex: 'handelRemark',
            search: false
        },
        subTitle: {
            dataIndex: 'insertTime',
        },
        actions: {
            dataIndex: 'actions',
            render: (_, record) => (
                <>
                    {
                        key == 4
                            ? <>
                                <Button type='link' onClick={() => getDetail(record)}>详情</Button>
                                <Button type='link' style={{ "color": "red" }} onClick={() => removeFollow(record)}>移除</Button>
                            </>
                            : <>
                                <Button type='link' onClick={() => handleAccess(record)}>修改</Button>
                                <Button type='link' style={{ "color": "red" }} onClick={() => removeFollow(record)}>移除</Button>
                                <Button type='link' onClick={() => getDetail(record)}>详情</Button>
                            </>
                    }

                </>
            ),
        }
    }

    const messageMetas = {
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
        type: {
            dataIndex: 'shenQingType',
            title: '来源',
            initialValue: 1,
            hideInSearch: key !== "3",
            request: async () => [
                {
                    label: '我发出的',
                    value: 1
                },
                {
                    label: '别人发出的',
                    value: 2
                }
            ],
        },
        actions: {
            search: false,
            render: (_, record) => (
                <>
                    {btnObj(key, followOrJoin, record)}
                </>

            ),
        },
        status: {
            title: "状态",
            dataIndex: 'parentRead',
            valueType: 'select',
            initialValue: "-1",
            request: async () => [
                {
                    label: '全部',
                    value: "-1"
                },
                {
                    label: '未读',
                    value: "0"
                },
                {
                    label: '已读',
                    value: "1"
                }
            ],
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
                    pagination={{
                        pageSize: 5,
                    }}
                    rowKey="name"
                    headerTitle={messageTabObj[key]}
                    request={getMessageList}
                    showActions="hover"
                    showExtra="hover"
                    search={!(key == 4 || key == 5)}
                    metas={key == 4 || key == 5 ? joinMetas : messageMetas}
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
    )
}