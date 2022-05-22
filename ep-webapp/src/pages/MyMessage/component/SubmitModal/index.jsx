import React from 'react'
import { ModalForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import axios from 'axios';

export default ({ options, record, userId, createTime }) => {
    const onFinish = async (val) => {
        if (options === "refuse") {
            await axios.get(`http://localhost:8083/message/jiaruNo`, {
                params: {
                    jiaruId: record.jiaruId,
                    userId: userId?.id,
                    adminRemark: val.publicVal,
                }
            })
        } else {
            await axios.post(`http://localhost:8083/boke/addComment`, {
                content: val.publicVal,
                createTime,
                parentId: record?.sendId,
                sendId: userId.id,
                userName: userId?.nickname,
                parentName: record?.userName,
                commentLouzhu: record?.louzhu,
                typeName: record?.typeName,
                orderId: record?.orderId,
                type: record?.type,
                messageType: 2
            })
        }

        return true
    }

    return (
        <>
            <ModalForm
                title={options === "refuse" ? "拒绝" : "回复"}
                trigger={options === "refuse" ? <Button type='link'>拒绝</Button> : <Button type='link'>回复</Button>}
                width={600}
                layout="horizontal"
                onFinish={onFinish}
                destroyOnClose
                preserve={false}
            >
                <ProFormText
                    name="publicVal"
                    label={options === "refuse" ? "拒绝原因" : "回复内容"}
                    placeholder={options === "refuse" ? "请填写拒绝原因" : "请填写回复内容"}
                />
            </ModalForm>
        </>
    )
}