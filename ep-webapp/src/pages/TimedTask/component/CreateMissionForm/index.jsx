import React from "react";
import {
    ModalForm,
    ProFormText
} from "@ant-design/pro-form";
import { Button } from "antd";
import axios from "axios";

export default ({ options, record, formRef }) => {

    const onFinish = async (val) => {
        if (options === "create") {
            await axios.get("http://localhost:8083/quartz/createJob", {
                params: {
                    ...val,
                }
            })
        } else {
            await axios.get("http://localhost:8083/quartz/update", {
                params: {
                    ...val,
                    jobJd: record?.jobId
                }
            })
        }
        formRef.current?.reload()
        return true
    }

    return (
        <ModalForm
            trigger={options === "create" ? <Button type="primary">新建任务</Button> : <Button type="link">修改</Button>}
            title={`${options === "create" ? "新建任务" : "修改任务"}`}
            onFinish={onFinish}
            preserve={false}
            modalProps={{
                destroyOnClose: true
            }}
            width={700}
        >
            <ProFormText name="jobName" label="任务名称：" placeholder="请输入任务名称" initialValue={record?.jobName} />
            <ProFormText name="cronExpression" label="表达式：" placeholder="请输入表达式" initialValue={record?.cronExpression} />
        </ModalForm >
    )
}