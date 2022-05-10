import React, { useRef } from 'react'
import { Button, Tag, Popconfirm } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { statusObj } from '@/configuration';
import CreateMissionForm from './component/CreateMissionForm';
import axios from 'axios';
import styles from './styles.less'

export default () => {
    const formRef = useRef()

    // 获取列表
    const fetchList = async (params, sort, filter) => {
        const { data: uId } = await axios.get(`/api/login/getuser`)
        const { data: list } = await axios.get(`http://localhost:8083/quartz/list`, {
            params: {
                pno: params?.current,
                psize: params?.pageSize,
                userId: uId.id,
                jobName: params?.jobName,
                status: filter?.status[0]
            }
        })

        return {
            data: list?.quartzBeans,
            total: list?.count
        }
    }

    // 调用一次方法
    const startOnceMission = async ({ id }) => {
        const { data } = await axios.get(`http://localhost:8083/quartz/runOnce?jobId=${id}`)
        console.log(data)
        formRef.current?.reload()
    }

    // 启动方法
    const startUpMission = async ({ id }) => {
        const { data } = await axios.get(`http://localhost:8083/quartz/resume?jobId=${id}`)
        console.log(data)
        formRef.current?.reload()
    }

    // 暂停方法
    const stoppingMission = async ({ id }) => {
        const { data } = await axios.get(`http://localhost:8083/quartz/pauseJob?jobId=${id}`)
        console.log(data)
        formRef.current?.reload()
    }

    // 删除方法
    const deleteMission = async ({ id }) => {
        const { data } = await axios.get(`http://localhost:8083/quartz/delect?jobId=${id}`)
        console.log(data)
        formRef.current?.reload()
    }

    const columns = [
        {
            title: '任务名',
            dataIndex: 'jobName',
        },
        {
            title: '表达式',
            dataIndex: 'cronExpression',
            search: false
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 160,
            align: 'center',
            render: (_, record) => (
                <Tag icon={statusObj[record?.status]?.icon} color={statusObj[record?.status]?.color}>{statusObj[record?.status]?.label}</Tag>
            ),
            filters: [
                { text: '全部', value: 0 },
                { text: '运行中', value: 1 },
                { text: '已停止', value: 2 },
            ],
            defaultFilteredValue: `${[0]}`,
            filterMultiple: false,
            search: false
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 400,
            align: "center",
            search: false,
            render: (_, record) => (
                <>
                    <Popconfirm
                        title="是否运行一次此任务?"
                        onConfirm={() => startOnceMission(record)}
                    >
                        <Button type="link">运行一次</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => startUpMission(record)}>启动</Button>
                    <Button type="link" onClick={() => stoppingMission(record)}>暂停</Button>
                    <Popconfirm
                        title="是否删除此任务?"
                        onConfirm={() => deleteMission(record)}
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <CreateMissionForm options="modify" record={record} formRef={formRef} />
                </>
            )
        }
    ]

    return (
        <>
            <PageContainer>
                <ProTable
                    className={styles.searchBar}
                    columns={columns}
                    actionRef={formRef}
                    request={fetchList}
                    search={{
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse(),
                            <CreateMissionForm options="create" formRef={formRef} />
                        ]
                    }}
                />
            </PageContainer>
        </>
    )
}