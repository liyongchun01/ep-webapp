import React, { useRef, useState } from 'react'
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout'
import axios from 'axios';
import { Card, Comment, Divider, Tag } from 'antd';
import { MessageOutlined, LikeOutlined, DeleteOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
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
    const [userId, setUserId] = useState(1001)
    const [blogInfo, setBolgInfo] = useState()
    const [inputId, setInputId] = useState()
    const [inputVisible, setInputVisible] = useState(false)
    // const blogInfo = {
    //     louzhu: 1,
    //     guanzhu: 0,
    //     jiaru: 0, //0未加入。1待通过，2已加入
    //     type: 1,
    //     orderId: 10011,
    //     parentName: '语雀的天空',
    //     hesuan: {
    //         hesuanPosition: "黑龙江省哈尔滨市南岗区学府路246号",
    //         hesuanName: "哈尔滨市医大二院",
    //         startdate: "2022-5-10",
    //         starttime: "12:00",
    //         enddate: "2022-5-21",
    //         endtime: "13:00",
    //         renshu: 154,
    //         processTime: "2022-5-10 12:10",
    //         uploadTime: "2022-5-12 12:30"
    //     },
    //     yimiao: {
    //         yimiaoPosition: "黑龙江省哈尔滨市南岗区学府路246号",
    //         yimaioName: "哈尔滨市医大二院",
    //         orgType: "医院",
    //         batch: 3,
    //         renshu: 126,
    //         startdate: "2022-5-10",
    //         starttime: "12:00",
    //         enddate: "2022-5-21",
    //         endtime: "13:00",
    //         processTime: "2022-5-10 12:10",
    //         uploadTime: "2022-5-12 12:30"
    //     },
    //     gelidian: {
    //         gelidianPosition: "黑龙江省哈尔滨市南岗区学府路246号",
    //         gelidianName: "哈尔滨市医大二院",
    //         geliOrg: "医院",
    //         contact: "13019771851",
    //         grlirenshu: 190,
    //         enddate: "2022-5-12 12:30",
    //         processTime: "2022-5-10 12:10",
    //         uploadTime: "2022-5-12 12:30"
    //     },
    //     guiji: [
    //         {
    //             starttime: "2022-5-10 12:10",
    //             endtime: "2022-6-10 13:00",
    //             guijiPosition: "百盛"
    //         },
    //         {
    //             starttime: "2022-5-10 12:10",
    //             endtime: "2022-6-10 13:00",
    //             guijiPosition: "百盛"
    //         },
    //         {
    //             starttime: "2022-5-10 12:10",
    //             endtime: "2022-6-10 13:00",
    //             guijiPosition: "百盛"
    //         },
    //         {
    //             starttime: "2022-5-10 12:10",
    //             endtime: "2022-6-10 13:00",
    //             guijiPosition: "百盛"
    //         },
    //     ],
    //     qiekai: {
    //         "广顺路德禧假日酒店": "4月6日",
    //         "人民路127号鲜丰水果店": "4月6日",
    //         "海宁市妇幼保健院住院部": "4月6日",
    //         "工人路夜市": "4月6日",
    //         "海宁99商业广场": "4月6日",
    //         "洛南路6号方圆木门楼梯店": "4月6日",
    //         "硖川路海宁农商银行（城北支行）": "4月6日",
    //         "海宁宾馆": "4月6日",
    //         "爱尚水果（人民路112号）": "4月6日",
    //         "爱琴海购物公园": "4月6日",
    //         "爱琴海广场永辉超市": "4月6日",
    //         "阿亮水果生鲜超市（西南河后街西南河小区）": "4月6日",
    //         "斜桥镇综合服务点": "4月6日",
    //         "西山社区": "4月6日",
    //         "米米农家菜": "4月6日",
    //         "可爱可亲母婴生活馆": "4月6日",
    //         "西山路便民交易市场": "4月6日",
    //         "塘南东路60号奥普": "4月6日",
    //         "海昌街道办事处": "4月6日",
    //         "窗之都（海宁旗舰店）": "4月6日",
    //         "海宁市中医院": "4月6日",
    //         "海宁市中心菜市场": "4月6日",
    //         "芙蓉里6幢": "4月6日",
    //         "狮岭幼儿园": "4月6日",
    //         "人民路112号": "4月6日",
    //         "东勒线东郊水果特卖场": "4月6日",
    //         "硖石街道社区卫生服务中心": "4月6日"
    //     },
    //     commentList: [
    //         {
    //             parentName: '语雀的天空',
    //             content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //             louzhu: 0,
    //             sendId: 1001,
    //             commeId: 1010,
    //             level: 1,
    //             guanzhu: 0
    //         },
    //         {
    //             parentName: 'Ant Design',
    //             content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //             louzhu: 0,
    //             sendId: 1002,
    //             commeId: 1020,
    //             level: 0,
    //         },
    //         {
    //             parentName: '蚂蚁金服体验科技',
    //             content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //             louzhu: 1,
    //             sendId: 1003,
    //             commeId: 1030,
    //             level: 0,
    //         },
    //         {
    //             parentName: 'TechUI',
    //             content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //             louzhu: 0,
    //             sendId: 1004,
    //             commeId: 1040,
    //             level: 0,
    //         },
    //     ]
    // }

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
        setUserId(uId.id)
        setBolgInfo(list)

        return {
            data: list?.commentList,
            total: list?.count
        }
    }

    // 删除评论方法
    const deleteComment = async ({ commeId }) => {
        await axios.get(`http://localhost:8083/boke/delectComment`, {
            params: {
                commeId,
                userId
            }
        })
        formRef.current?.reload()
    }

    // 关注方法
    const followBlog = async (val) => {
        await axios.get(`http://localhost:8083/boke/guanzhu`, {
            params: {
                userId,
                orderId,
                type,
                typeId,
                createTime,
                typeName: blogInfo[callbackFieldsKeys[blogInfo.type]][callbackFieldsPositionKeys[blogInfo.type]],
                guanzhu: val
            }
        })
        formRef.current?.reload()
    }

    // 置顶方法
    const toppingComment = async ({ commeId, level }) => {
        await axios.get(`http://localhost:8083/boke/upComment`, {
            params: {
                commeId,
                level,
                userId
            }
        })
        formRef.current?.reload()
    }

    // 协同编辑
    const joinEdit = async (userRemark, jiaru) => {
        await axios.get(`http://localhost:8083/boke/jiaru`, {
            params: {
                fromUserId: userId,
                orderId,
                type,
                userRemark,
                typeId,
                createTime,
                typeName: blogInfo[callbackFieldsKeys[blogInfo.type]][callbackFieldsPositionKeys[blogInfo.type]],
                jiaru
            }
        })
        formRef.current?.reload()
    }

    const childReplay = (record) => {
        setInputId(record.commeId)
        setInputVisible(!inputVisible)
    }

    const IconText = ({ icon, text, event }) => (
        <span className={styles.iconStyle}>
            {React.createElement(icon, {
                style: { marginRight: 8 },
                onClick: () => {
                    event()
                    setInputVisible(!inputVisible)
                }
            })}
            {text}
        </span>
    );

    // const dataSource = [
    //     {
    //         parentName: '语雀的天空',
    //         parentId: 1101,
    //         content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //         commentLouzhu: 0,
    //         sendId: 1001,
    //         commeId: 1010,
    //         level: 1,
    //         guanzhu: 0,
    //         userName: "awefe",
    //         typeName: "hesuan",
    //     },
    //     {
    //         parentName: 'Ant Design',
    //         parentId: 1102,
    //         content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //         commentLouzhu: 0,
    //         sendId: 1002,
    //         commeId: 1020,
    //         level: 0,
    //         userName: "awefe",
    //         typeName: "hesuan",
    //     },
    //     {
    //         parentName: '蚂蚁金服体验科技',
    //         parentId: 1103,
    //         content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //         commentLouzhu: 1,
    //         sendId: 1003,
    //         commeId: 1030,
    //         level: 0,
    //         userName: "awefe",
    //         typeName: "hesuan",
    //     },
    //     {
    //         parentName: 'TechUI',
    //         parentId: 1104,
    //         content: '段落示意: 蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态, 提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台design.alipay.com, 用最小的工作量, 无缝接入蚂蚁金服生态提供跨越设计与开发的体验解决方案。',
    //         commentLouzhu: 0,
    //         sendId: 1004,
    //         commeId: 1040,
    //         level: 0,
    //         userName: "awefe",
    //         typeName: "hesuan",
    //     },
    // ];

    const metas = {
        title: {
            dataIndex: 'parentName',
            title: '用户名',
            render: (_, record) => (
                <>
                    {record.parentName}
                    {record?.commentLouzhu === 1 && <Tag color="blue" style={{ 'marginLeft': 10 }}>楼主</Tag>}
                    {record?.level === 1 && <Tag color="red" style={{ 'marginLeft': 10 }}>置顶</Tag>}
                </>
            )
        },
        subTitle: {
            dataIndex: 'content'
        },
        description: {
            render: (_, record) => (
                <Card
                    type="inner"
                    style={{ "background": "#f4f4f4", "borderRadius": 5 }}
                    bordered={false}
                >
                    <Comment
                        author={<a>Han Solo</a>}
                        actions={[<span onClick={() => childReplay(record)} key="comment-nested-reply-to">回复</span>]}
                        content={
                            <p>
                                这是一条回复评论
                            </p>
                        }
                        datetime={
                            <span>{moment("2022-05-17 15:30", "YYYY-MM-DD HH:mm").fromNow()}</span>
                        }
                    />
                    <Comment
                        author={<a>Han Solo</a>}
                        actions={[<span onClick={() => childReplay(record)} key="comment-nested-reply-to">回复</span>]}
                        content={
                            <p>
                                这是一条回复评论
                            </p>
                        }
                        datetime={
                            <span>{moment("2022-05-17 15:30", "YYYY-MM-DD HH:mm").fromNow()}</span>
                        }
                    />
                    <a>更多</a>
                </Card>
            )
        },
        actions: {
            render: (_, record) => [
                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" event={() => console.log("点赞")} />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" event={() => setInputId(record.commeId)} />,
                record?.level === 1 || blogInfo.louzhu === 1 && <VerticalAlignTopOutlined className={styles.iconStyle} onClick={() => toppingComment(record)} />,
                record?.sendId === userId && <DeleteOutlined className={styles.ellipsisStyle} onClick={() => deleteComment(record)} />
            ],
        },
        content: {
            render: (_, record) => (
                inputVisible && inputId === record.commeId
                && <InputCard
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ "background": "transparent" }}
                    record={record}
                    messageType={2}
                    setInputVisible={setInputVisible}
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
                    // dataSource={dataSource}
                    metas={metas}
                    split={true}
                    pagination={{
                        pageSize: 5,
                    }}
                    headerTitle={
                        <Divider>评论</Divider>
                    }
                />
                <InputCard autoSize={{ minRows: 5, maxRows: 5 }} style={{}} blogInfo={blogInfo} messageType={1} formRef={formRef} />
            </PageContainer>
        </>
    )
}