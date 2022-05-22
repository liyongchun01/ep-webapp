import React, { useRef, useState } from 'react'
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout'
import axios from 'axios';
import { Divider, Tag } from 'antd';
import { MessageOutlined, DeleteOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import styles from './styles.less'
import InputCard from './component/InputCard';
import moment from 'moment';
import { callbackFieldsKeys, callbackFieldsPositionKeys } from '@/configuration';
import HeaderCard from './component/HeaderCard';

export default () => {
    const formRef = useRef()
    const timestamp = moment(new Date()).valueOf();
    const createTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    const { orderId, type, typeId } = history.location.query
    const [userId, setUserId] = useState({})
    const [blogInfo, setBlogInfo] = useState()
    const [inputId, setInputId] = useState(null)
    const [inputVisible, setInputVisible] = useState(false)

    // 获取评论列表信息
    const getBlogData = async (params) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.get(`http://localhost:8083/boke/list`, {
            params: {
                userId: uId?.id,
                orderId,
                type,
                typeId,
                pno: params?.current,
                psize: params?.pageSize,
            }
        })
        setUserId(uId)
        setBlogInfo(list)

        return {
            data: list?.commentList,
            total: list?.count
        }
    }

    // 删除评论方法
    const deleteComment = async ({ commentId }) => {
        await axios.get(`http://localhost:8083/boke/delectComment`, {
            params: {
                commentId,
                userId: userId.id
            }
        })
        formRef.current?.reload()
    }

    // 关注方法
    const followBlog = async (val) => {
        await axios.post(`http://localhost:8083/boke/guanzhu`, {
            userId: userId.id,
            orderId,
            type,
            typeId,
            createTime,
            typeName: blogInfo[callbackFieldsKeys[blogInfo.type]][callbackFieldsPositionKeys[blogInfo.type]],
            guanzhu: val
        })
        formRef.current?.reload()
    }

    // 置顶方法
    const toppingComment = async ({ commentId, level }) => {
        await axios.get(`http://localhost:8083/boke/upComment`, {
            params: {
                commentId,
                level: level === 1 ? 0 : 1,
                userId: userId.id
            }
        })
        formRef.current?.reload()
    }

    // 协同编辑
    const joinEdit = async (userRemark, jiaru) => {
        await axios.post(`http://localhost:8083/boke/jiaru`, {
            fromUserId: userId.id,
            orderId,
            type,
            userRemark,
            typeId,
            createTime,
            typeName: blogInfo[callbackFieldsKeys[blogInfo.type]][callbackFieldsPositionKeys[blogInfo.type]],
            jiaru
        })
        formRef.current?.reload()
    }

    const deleteHandle = (record) => {
        setInputId(record.commentId)
        setInputVisible(!inputVisible)
    }

    const metas = {
        title: {
            dataIndex: 'parentName',
            title: '用户名',
            render: (_, record) => (
                <>
                    {record?.userName}
                    {record?.commentLouzhu === 1 && <Tag color="blue" style={{ 'marginLeft': 10 }}>楼主</Tag>}
                    {record?.messageType === 2 &&
                        <>
                            <span style={{ "fontSize": "12px", "color": "rgba(0, 0, 0, 0.45)", "marginLeft": "5px" }}>回复</span> <span style={{ "color": "#1890FF" }}>{`@${record?.parentName} `} </span>:
                        </>
                    }
                    {record?.level === 1 && <Tag color="red" style={{ 'marginLeft': 10 }}>置顶</Tag>}
                </>
            )
        },
        subTitle: {
            dataIndex: 'content'
        },
        actions: {
            render: (_, record) => (
                <>
                    <div style={{ "display": "flex", "justifyContent": "space-between" }} >
                        <div>{record.createTime}</div>
                        <div>
                            <MessageOutlined className={styles.commentStyle} onClick={() => deleteHandle(record)} />
                            {blogInfo.louzhu === 1 && <VerticalAlignTopOutlined className={styles.iconStyle} onClick={() => toppingComment(record)} />}
                            {record?.sendId === userId.id && <DeleteOutlined className={styles.ellipsisStyle} onClick={() => deleteComment(record)} />}
                        </div>
                    </div>

                </>

            )
        },
        content: {
            render: (_, record) => (
                inputVisible && inputId === record.commentId
                && <InputCard
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ "background": "transparent" }}
                    record={record}
                    messageType={2}
                    blogInfo={blogInfo}
                    setInputVisible={setInputVisible}
                    userInfo={userId}
                    formRef={formRef}
                />
            )
        }
    }
    return (
        <>
            <PageContainer
                header={{
                    title: ""
                }}
            >
                <HeaderCard blogInfo={blogInfo} followBlog={followBlog} joinEdit={joinEdit} formRef={formRef} />
                <ProList
                    actionRef={formRef}
                    className={styles.headerDivider}
                    itemLayout="vertical"
                    rowKey="id"
                    request={getBlogData}
                    metas={metas}
                    split={true}
                    pagination={{
                        pageSize: 5,
                    }}
                    headerTitle={
                        <Divider>评论</Divider>
                    }
                />
                <InputCard autoSize={{ minRows: 5, maxRows: 5 }} userInfo={userId} style={{}} blogInfo={blogInfo} messageType={1} formRef={formRef} />
            </PageContainer>
        </>
    )
}