import React, { useEffect, useRef, useState } from 'react';
import { Button, Tag } from 'antd';
import ProList from '@ant-design/pro-list';
import { PageContainer } from '@ant-design/pro-layout';
import {
    messageTab,
    messageTabObj,
    serviceTypeObject,
    readObj,
    callbackFieldsKeys,
    callbackFieldsPositionKeys,
    listObj,
    commentCallback,
    getTypeId,
    joinStatus
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
    const [userId, setuserId] = useState({})
    const [followOrJoin, setFollowOrJoin] = useState(1)
    const [detailVisible, setDetailVisible] = useState(false)
    const [recordList, setRecordList] = useState({})
    const [anyId, setAnyId] = useState({})
    const timestamp = moment(new Date()).valueOf();
    const createTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

    const getMessageList = async (params) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        setuserId(uId)
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
                    shenQingType: key == "3" ? (params?.hasOwnProperty("shenQingType") ? params?.shenQingType : 1) : null
                }
            })
            setFollowOrJoin(params?.hasOwnProperty("shenQingType") ? params?.shenQingType : 1)

            return {
                data: key == "3" ? list[listObj[key][params?.hasOwnProperty("shenQingType") ? params?.shenQingType : 1]] : list[listObj[key]],
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
                    {record.parentRead === "0" && <Button type='link' onClick={() => handleRead(record)}>??????</Button>}
                </>,
                "1": <>
                    {record.parentRead === "0" && <Button type='link' onClick={() => handleRead(record)}>??????</Button>}
                    <SubmitModal options="reply" formRef={formRef} userId={userId} record={record} createTime={createTime} />
                </>,
                "2": <>
                    {record.parentRead === "0" && <Button type='link' onClick={() => handleRead(record)}>??????</Button>}
                    <SubmitModal options="reply" formRef={formRef} userId={userId} record={record} createTime={createTime} />
                </>
            }
            return normalObj[key]
        } else {
            const complexBtn = {
                1: <>
                    <SubmitModal options="refuse" formRef={formRef} userId={userId} record={record} createTime={createTime} />
                    <Button type='link' onClick={() => handleAccess(record)}>??????</Button>
                </>,
                2: <>

                </>
            }
            return complexBtn[followOrJoin]
        }

    }

    // ??????????????????
    const getDetail = async (record) => {
        fetchDetail(record)
        setDetailVisible(true)
        setAnyId(record)
    }

    //??????????????????
    const fetchDetail = async ({ type, typeId, orderId }) => {
        const { data } = await axios.get(`http://localhost:8083/upload/orderSee`, {
            params: {
                type: type,
                typeId: typeId,
                orderId: orderId
            }
        })
        if (type == 1) {
            setRecordList(data.heSuan)
        } else if (type == 2) {
            setRecordList(data.yiMiao)
        } else if (type == 3) {
            setRecordList(data.geli)
        } else {
            setRecordList(data)
        }
    }

    // ????????????
    const handleAccess = async (reocrd) => {
        await axios.get(`http://localhost:8083/message/jiaruOk`, {
            params: {
                jiaruId: reocrd.jiaruId,
                userId: userId.id
            }
        })
        formRef.current?.reload()
    }

    // ????????????
    const handleRead = async (record) => {
        await axios.get(`http://localhost:8083/message/read`, {
            params: {
                messageType: key,
                commentId: record.commentId,
                jiaruId: key == 3 ? record.jiaruId : record.commentId,
                userId: userId.id
            }
        })
        formRef.current?.reload()
    }

    // ????????????
    const toBlog = (record) => {
        history.push({
            pathname: '/blog',
            query: {
                type: record.type,
                orderId: record.orderId,
                typeId: +record[getTypeId[key]]
            },
        });
    }

    // ????????????
    const removeFollow = async ({ orderId, type, typeId, typeName }) => {
        await axios.post(`http://localhost:8083/boke/guanzhu`, {
            userId: userId?.id,
            orderId,
            type,
            typeId,
            createTime,
            typeName,
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
                    <span>???{record.typeName}???</span>
                </>
            ),
        },
        description: {
            dataIndex: 'handelRemark',
            search: false,
            render: (_, record) => (
                <>
                    {record?.type === 4 ? (record?.handelRemark ? JSON.parse(record?.handelRemark).desc : record.handelRemark) : record.handelRemark}
                </>
            )
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
                                <Button type='link' onClick={() => getDetail(record)}>??????</Button>
                                <Button type='link' style={{ "color": "red" }} onClick={() => removeFollow(record)}>??????</Button>
                            </>
                            : <>
                                <Button type='link' style={{ "color": "red" }} onClick={() => removeFollow(record)}>??????</Button>
                                <Button type='link' onClick={() => getDetail(record)}>??????</Button>
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
                        <span style={{ "fontSize": "16px", "fontWeight": "600" }}>{
                            key == 3 ? record?.remark : record?.userName
                        }</span>
                        <span> ???{serviceTypeObject[record.type]}: ???{record.typeName}???{commentCallback[key]} </span>
                        {
                            key == 3
                                ? <Tag style={{ "marginLeft": "10px" }} color={joinStatus[record?.jiaru]?.color}>{joinStatus[record?.jiaru]?.label}</Tag>
                                : <span style={{ "color": "rgba(0, 0, 0, 0.45)", "fontSize": "12px", "marginLeft": "10px" }}>{readObj[record.parentRead]}</span>
                        }
                    </div>
                </>
            )
        },
        subTitle: {
            title: "??????",
            dataIndex: 'type',
            valueType: 'select',
            initialValue: 0,
            request: async () => [
                {
                    label: '??????',
                    value: 0
                },
                {
                    label: '????????????',
                    value: 1
                },
                {
                    label: '????????????',
                    value: 2
                },
                {
                    label: '????????????',
                    value: 3
                },
                {
                    label: '????????????',
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
            search: false,
            render: (_, record) => (
                <>
                    {
                        key == 3
                            ? (record?.jiaru == 0 ? record?.adminRemark : record?.userRemark)
                            : record?.content
                    }
                </>
            )
        },
        type: {
            dataIndex: 'shenQingType',
            title: '??????',
            initialValue: 1,
            hideInSearch: key != "3",
            request: async () => [
                {
                    label: '????????????',
                    value: 2
                },
                {
                    label: '???????????????',
                    value: 1
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
            title: "??????",
            dataIndex: 'parentRead',
            valueType: 'select',
            initialValue: "-1",
            request: async () => [
                {
                    label: '??????',
                    value: "-1"
                },
                {
                    label: '??????',
                    value: "0"
                },
                {
                    label: '??????',
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