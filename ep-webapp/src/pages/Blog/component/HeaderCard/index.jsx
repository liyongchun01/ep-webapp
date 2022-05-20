import React, { useState } from "react"
import { EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Modal, Form, Input, Popconfirm, Popover, Tag, Empty } from "antd"
import moment from 'moment';
import DescriptionsCard from "../DescriptionsCard";
import { callbackFieldsKeys, serviceTypeObject, callbackFieldsNameKeys } from "@/configuration";

const { Meta } = Card;
export default ({ blogInfo, followBlog, joinEdit, formRef }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [jiaruStatus, setJiaruStatus] = useState(null)
    const [form] = Form.useForm()
    const btnObj = {
        0:
            <Popover content="通过加入申请后, 你也将成为楼主" >
                <Button onClick={() => joinEditHandle(1)} type="primary" shape="round" icon={<EditOutlined />} style={{ "marginRight": "10px" }} >
                    加入
                </Button>
            </Popover>,
        1:
            <Button onClick={() => joinEditHandle(0)} type="default" shape="round" disabled style={{ "marginRight": "10px" }}>
                待通过
            </Button>,
        2:
            <Popconfirm title="是否退出此疫情信息编辑？" okText="确定" cancelText="取消" onConfirm={() => cancleJoin()}>
                <Button type="default" shape="round" style={{ "marginRight": "10px", "color": "rgba(0, 0, 0, 0.45)" }} >
                    已加入
                </Button>
            </Popconfirm >
    }

    const cancleJoin = () => {
        joinEdit("", 0)
        formRef.current?.reload()
    }

    const joinEditHandle = (status) => {
        setModalVisible(true)
        setJiaruStatus(status)
    }

    const onOk = () => {
        form.submit()
    }

    const onFinish = async ({ userRemark }) => {
        setModalVisible(false)
        joinEdit(userRemark, jiaruStatus)
        formRef.current?.reload()
    }

    return (
        <>
            {blogInfo
                ? <>
                    <Card
                        title={
                            <span style={{ "fontWeight": "bolder" }}>
                                {

                                    blogInfo?.type !== 4
                                        ? `${serviceTypeObject[blogInfo?.type]}: ${blogInfo[callbackFieldsKeys[blogInfo?.type]][callbackFieldsNameKeys[blogInfo?.type]]}`
                                        : `${serviceTypeObject[blogInfo?.type]}`
                                }
                            </span>
                        }
                        extra={
                            <>
                                {
                                    btnObj[blogInfo?.jiaru]
                                }
                                {
                                    blogInfo?.guanzhu === 0
                                        ? <Button onClick={() => followBlog(1)} type="primary" shape="round" icon={<PlusOutlined />} >
                                            关注
                                        </Button>
                                        : <Popconfirm title="确定取消关注吗？" okText="确定" cancelText="取消" onConfirm={() => followBlog(0)}>
                                            <Button type="default" shape="round" style={{ "marginRight": "10px", "color": "rgba(0, 0, 0, 0.45)" }}  >
                                                已关注
                                            </Button>
                                        </Popconfirm >
                                }
                            </>
                        }
                    >
                        <Card type="inner" style={{ "marginBottom": 16 }}>
                            <Meta
                                title={
                                    <>
                                        {blogInfo?.parentName}
                                        <span style={{ "fontSize": "13px", "color": "rgba(0, 0, 0, 0.45)" }}> <span>{moment("2022-05-17 15:30", "YYYY-MM-DD HH:mm").fromNow()}</span></span>
                                    </>
                                }
                                description="This is the description"
                                icon={<Tag color="#108ee9">#108ee9</Tag>}
                            />
                        </Card>
                        <Meta
                            description={
                                <>
                                    <DescriptionsCard blogInfo={blogInfo} />
                                </>
                            }
                        />
                    </Card >
                    <Modal
                        title="加入编辑"
                        visible={modalVisible}
                        width={700}
                        destroyOnClose
                        onOk={onOk}
                        onCancel={() => setModalVisible(false)}
                    >
                        <Form
                            form={form}
                            onFinish={onFinish}
                            preserve={false}
                        >
                            <Form.Item required label="加入原因" name="userRemark">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
                : <Card>
                    <Empty />
                </Card>
            }
        </>
    )
}