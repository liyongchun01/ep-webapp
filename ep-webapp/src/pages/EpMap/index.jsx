import React, { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Button, Skeleton, DatePicker, Form, Input } from 'antd';
import MainMap from '@/components/MainMap';
import { tabList } from '@/configuration';
import { TextLoop } from 'react-text-loop-next';
import axios from 'axios';
import styles from './styles.less'
import moment from 'moment';

const { RangePicker } = DatePicker;
export default () => {
    const [form] = Form.useForm()
    const [key, setKey] = useState(1)
    const [newList, setNewList] = useState([])
    const [filterFields, setFilterFields] = useState({ tian: 30 })
    const [refresh, setRefresh] = useState(true)
    const [modiFields, setModiFields] = useState({
        modiMapCenter: []
    })

    const getNewsList = async () => {
        const { data: newone } = await axios.get("http://api.tianapi.com/ncov/index", {
            params: {
                key: "d334721cf6eba2d619a5855420ec352c"
            }
        })
        if (newone) {
            setNewList(newone?.newslist[0].news)
        }
    }

    useEffect(() => {
        getNewsList()
    }, [])

    const newsAlert = () => {
        if (newList.length !== 0) {
            return (
                <>
                    <Alert
                        banner
                        closable
                        showIcon={false}
                        type="info"
                        className={styles.alert_overflow}
                        message={
                            <TextLoop
                                mask
                                interval={5000}
                                children={newList.map(item => (
                                    <Button type='link' key={item.id} target="_blank" href={item.sourceUrl}>{`${item.infoSource}(${item.pubDateStr}): ${item.summary}`}</Button>
                                ))}
                            />
                        }
                    />
                </>
            )
        } else {
            return (
                <Skeleton.Input size='large' active block loading={newList.length !== 0} style={{ height: 48 }} />
            )
        }
    }

    const onFinish = (val) => {
        if (val.timeRange) {
            const getAllFields = {
                tian: val.tian,
                btime: moment(val?.timeRange[0]).format('YYYY-MM-DD hh:mm'),
                etime: moment(val?.timeRange[1]).format('YYYY-MM-DD hh:mm')
            }
            setFilterFields(getAllFields)
        } else {
            const getPartOfFields = {
                tian: val.tian,
            }
            setFilterFields(getPartOfFields)
        }
        setRefresh(false)
        setRefresh(true)
    }

    const filterBar = () => {
        return (
            <>
                <Form
                    className={styles.formStyle}
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item label="最近几天" name="tian">
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item label="时间范围" style={{ "margin": "0 10px" }} name="timeRange">
                        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }

    return (
        <PageContainer
            tabList={tabList}
            onTabChange={(key) => setKey(key)}
            content={newsAlert()}
            tabBarExtraContent={filterBar()}
        >
            {
                refresh && <Card>
                    <MainMap
                        filterFields={filterFields}
                        type={+key}
                        key={key}
                        modiFields={modiFields}
                        setModiFields={setModiFields}
                    />
                </Card>
            }

        </PageContainer>
    );
};
