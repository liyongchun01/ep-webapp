import React from 'react'
import { Card, Form, Input, Button } from 'antd'
import styles from '../../styles.less'
import axios from 'axios';
import moment from 'moment';
import { callbackFieldsId, callbackFieldsKeys, callbackFieldsNameKeys } from '@/configuration';

const { TextArea } = Input;
export default ({ autoSize, style, blogInfo, userInfo, record, messageType, setInputVisible, formRef }) => {
    const [form] = Form.useForm()
    const timestamp = moment(new Date()).valueOf();
    const createTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    const onFinish = async ({ content }) => {
        messageType === 2 && setInputVisible(false)
        await axios.post(`http://localhost:8083/boke/addComment`, {
            content,
            createTime,
            messageType,
            parentId: record?.sendId,
            sendId: userInfo.id,
            userName: userInfo?.nickname,
            parentName: record?.userName,
            commentLouzhu: blogInfo?.louzhu,
            typeName: blogInfo[callbackFieldsKeys[blogInfo?.type]][callbackFieldsNameKeys[blogInfo?.type]],
            orderId: blogInfo[callbackFieldsKeys[blogInfo?.type]]?.orderId,
            type: blogInfo?.type,
            userRemark: blogInfo[callbackFieldsKeys[blogInfo?.type]][callbackFieldsId[blogInfo?.type]]?.toString()
        })
        form.setFieldsValue({ content: "" })
        formRef.current?.reload()
    }

    return (
        <>
            <Card className={styles.inputCard} style={style}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                >
                    <Form.Item name="content">
                        <TextArea
                            placeholder="请输入评论"
                            autoSize={autoSize}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 22, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            提交回复
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}