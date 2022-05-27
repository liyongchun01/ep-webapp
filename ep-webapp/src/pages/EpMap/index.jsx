import React, { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Button, Skeleton, DatePicker, Form, Input, Popover, message } from 'antd';
import MainMap from '@/components/MainMap';
import { tabList } from '@/configuration';
import { TextLoop } from 'react-text-loop-next';
import axios from 'axios';
import styles from './styles.less'
import moment from 'moment';
import { CloseOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
export default () => {
    const [form] = Form.useForm()
    const [key, setKey] = useState(1)
    const [newList, setNewList] = useState([])
    const [filterFields, setFilterFields] = useState({ tian: 30 })
    const [refresh, setRefresh] = useState(true)
    const [region, setRegion] = useState() // 动态中心点
    const [weather, setWeather] = useState({})
    const [modiFields, setModiFields] = useState({
        modiMapCenter: []
    })
    const [popoverVisible, setPopoverVisible] = useState(false)
    const [isError, setIsError] = useState("success")

    // 逆地址解析
    const reAddressResolution = async () => {
        const { data: location } = await axios.get(`/ws/geocoder/v1/`, {
            params: {
                location: `${region?.lat},${region?.lng}`,
                key: "JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS",
            }
        })
        getWeather(location?.result?.address_component.city)
    }

    // 获取新闻列表
    const getNewsList = async () => {
        const { data: newone } = await axios.get("http://api.tianapi.com/ncov/index", {
            params: {
                key: "d334721cf6eba2d619a5855420ec352c"
            }
        })
        setNewList(newone?.newslist[0].news)
    }

    // 请求天气
    const getWeather = async (val) => {
        const { data: weather } = await axios.get(`http://wthrcdn.etouch.cn/weather_mini`, {
            params: {
                city: val
            }
        })
        setWeather(weather)
    }

    // 天气回填组件
    const outPutWeather = () => {
        if (weather.data) {
            return (
                <>
                    <Popover content={weather?.data.ganmao} placement="left">
                        <span>{weather?.data?.city}</span>
                        <span style={{ "margin": "0 10px" }}>{weather?.data?.forecast[0].type}</span>
                        <span>{weather?.data?.forecast[0].high}~{weather?.data.forecast[0].low}</span>
                    </Popover>
                </>
            )
        }
    }

    useEffect(() => {
        getNewsList()
        if (region) {
            reAddressResolution()
        }
    }, [region])

    // 回填新闻组件
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

    const onFinish = async (val) => {
        const getAllFields = {
            tian: isNaN(+val.tian) ? null : +val.tian,
            btime: val.timeRange ? moment(val?.timeRange[0]).format('YYYY-MM-DD hh:mm') : null,
            etime: val.timeRange ? moment(val?.timeRange[1]).format('YYYY-MM-DD hh:mm') : null
        }
        if (val.queryAddress) {
            const { data } = await axios.get(`/ws/geocoder/v1/`, {
                params: {
                    address: val.queryAddress,
                    key: "JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS"
                }
            })
            getAllFields.resAddress = data?.result?.location
            if (data?.status === 347) {
                setIsError("error")
            } else {
                setIsError("success")
                setFilterFields(getAllFields)
                setPopoverVisible(false)
                setRefresh(false)
                setRefresh(true)
            }
        } else {
            setIsError("success")
            setFilterFields(getAllFields)
            setPopoverVisible(false)
            setRefresh(false)
            setRefresh(true)
        }
    }

    const filterBar = () => {
        return (
            <>
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item className={styles.closeStyle}>
                        <CloseOutlined onClick={() => setPopoverVisible(false)} />
                    </Form.Item>
                    <Form.Item
                        label="地点查询"
                        name="queryAddress"
                        validateStatus={isError}
                        help={isError === "error" ? "请输入正确的地址" : null}
                    >
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item label="最近几天" name="tian">
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item label="时间范围" name="timeRange">
                        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                    <Form.Item style={{ "marginBottom": "5px" }}>
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
            tabBarExtraContent={
                <>
                    <Popover
                        visible={popoverVisible}
                        content={filterBar()}
                        placement="leftTop"
                    >
                        <Button onClick={() => setPopoverVisible(true)} type='primary' icon={<MenuFoldOutlined />}>检索</Button>
                    </Popover>
                </>
            }
            extra={outPutWeather()}
        >
            {
                refresh && <Card>
                    <MainMap
                        filterFields={filterFields}
                        type={+key}
                        key={key}
                        modiFields={modiFields}
                        setModiFields={setModiFields}
                        setRegion={setRegion}
                    />
                </Card>
            }
        </PageContainer>
    );
};
