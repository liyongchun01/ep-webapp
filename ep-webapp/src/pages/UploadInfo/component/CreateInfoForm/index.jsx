import React, { useEffect, useState } from "react";
import ProForm, {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProFormDateTimeRangePicker,
    ProFormDateTimePicker,
    ProFormList,
    ProFormGroup
} from "@ant-design/pro-form";
import { SnippetsOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, message } from "antd";
import { selectOptions } from "@/configuration";
import moment from 'moment';
import axios from "axios";

export default ({ options, userId, modifyField, formRef, anyId, fetchDetail, setDetailVisible }) => {
    const timestamp = moment(new Date()).valueOf();
    const formattime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    const [selectKey, setSelectKey] = useState(1)
    const [getAddress, setGetAddress] = useState([])
    const [form] = ProForm.useForm()

    useEffect(() => {
        if (modifyField) {
            setSelectKey(modifyField.type)
        }
    }, [modifyField])

    // 提交表单
    const submitData = async (data) => {
        await axios.post(`/api/upload/${options === "create" ? "add" : "update"}`, {
            ...data
        })
        if (options === "modified") {
            fetchDetail(anyId)
        }
    }

    // 经纬度转换
    const addressResolution = async (address) => {
        const { data } = await axios.get(`/ws/geocoder/v1/`, {
            params: {
                address,
                key: "JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS"
            }
        })
        if (data.status === 347) {
            message.error("地址格式错误！请输入 省 市 地点")
        }
        if (data.status === 306) {
            message.error("请输入地址")
        }
        if (selectKey !== 4) {
            setGetAddress([data?.result.location])
        }
        getAddress.push(data?.result.location)
        setGetAddress([...getAddress])

    }

    // 经纬度数组转换
    const addressArrResolution = async (address) => {
        for (let { name } of address) {
            const { data } = await axios.get(`/ws/geocoder/v1/`, {
                params: {
                    address: name,
                    key: "JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS"
                }
            })
            getAddress.push(data?.result.location)
            setGetAddress([...getAddress])
        }
    }

    const onFinish = async (val) => {
        let postData = {
            ...val,
            uploadTime: formattime,
            type: selectKey,
            userId: userId?.id,
            typeId: anyId?.typeId,
            orderId: anyId?.orderId
        }
        if ((!val.type || val.type === 1) || val.type === 2) {
            if (val.type === 2) {
                await addressResolution(val.yimiaoPosition)
            }
            if (!val.type || val.type === 1) {
                await addressResolution(val.hesuanPosition)
            }
            postData.starttime = val?.dateRange[0].split(" ")[1].toString()
            postData.endtime = val?.dateRange[1].split(" ")[1].toString()
            postData.startdate = val?.dateRange[0].split(" ")[0].toString()
            postData.enddate = val?.dateRange[1].split(" ")[0].toString()
            postData.jingdu = getAddress[0]?.lng
            postData.weidu = getAddress[0]?.lat
            delete postData.dateRange
        } else if (val.type === 3) {
            await addressResolution(val.gelidianPosition)
            postData.enddate = val?.dateRange.split(" ")[0].toString()
            postData.endtime = val?.dateRange.split(" ")[1].toString()
            postData.jingdu = getAddress[0]?.lng
            postData.weidu = getAddress[0]?.lat
            delete postData.dateRange
        } else if (val.type === 4) {
            await addressArrResolution(val.guijiArray)
            postData.guiji = val.guijiArray.map((item, index) => ({
                starttime: item?.datetime[0].toString(),
                endtime: item?.datetime[1].toString(),
                guiji_position: item?.name,
                jingdu: getAddress[index]?.lng,
                weidu: getAddress[index]?.lat,
            }))
            delete postData.guijiArray
            setDetailVisible(false)
        }
        submitData(postData)
        setGetAddress([])
        formRef.current?.reload()
        setSelectKey(1)
        return true
    }

    return (
        <>
            <ModalForm
                trigger={
                    options === "create"
                        ? <Button type="primary">添加信息</Button>
                        : <Button type="primary">修改</Button>
                }
                title={`${options === "create" ? "添加信息" : "修改信息"}`}
                onFinish={onFinish}
                form={form}
                preserve={false}
                modalProps={{
                    destroyOnClose: true
                }}
            >
                <ProFormSelect
                    request={async () => selectOptions}
                    width="md"
                    name="type"
                    label="上传类型: "
                    initialValue={modifyField?.type}
                    fieldProps={{
                        placeholder: "请选择上传类型",
                        onChange: (val) => setSelectKey(val),
                        defaultValue: selectKey
                    }}
                />
                {
                    selectKey === 1 &&
                    <>
                        <ProFormText
                            name="hesuanName"
                            label="核酸检测具体地点: "
                            placeholder="请输入核酸具体位置文字描述"
                            width="md"
                            initialValue={modifyField?.hesuanName}
                        />
                        <ProFormText
                            name="hesuanPosition"
                            label="核酸地点（县/区、镇/街道）: "
                            placeholder="请输入核酸地点"
                            width="md"
                            initialValue={modifyField?.hesuanPosition}
                        />
                        <ProFormText
                            name="renshu"
                            label="现有人数: "
                            placeholder="请输入现有人数、可以不填"
                            width="md"
                            initialValue={modifyField?.renshu}
                        />
                        <ProFormDateTimeRangePicker
                            name="dateRange"
                            label="有效时间: "
                            width="md"
                            initialValue={modifyField ? [moment(`${modifyField?.startdate} ${modifyField?.starttime}`, "YYYY-MM-DD HH:mm"), moment(`${modifyField?.enddate} ${modifyField?.endtime}`, "YYYY-MM-DD HH:mm")] : null} fieldProps={{
                                format: "YYYY-MM-DD HH:mm",
                                placeholder: ["开始时间", "结束时间"]
                            }}
                        />
                    </>
                }
                {
                    selectKey === 2 &&
                    <>
                        <ProFormText
                            name="yimaioName"
                            label="疫苗接种具体地点: "
                            placeholder="请输入疫苗接种具体位置文字描述"
                            width="md"
                            initialValue={modifyField?.yimaioName}
                        />
                        <ProFormText
                            name="yimiaoPosition"
                            label="接种地点（县/区、镇/街道）: "
                            placeholder="请输入疫苗接种地点"
                            width="md"
                            initialValue={modifyField?.yimiaoPosition}
                        />
                        <ProFormText
                            name="renshu"
                            label="现有人数: "
                            placeholder="请输入现有人数、可以不填"
                            width="md"
                            initialValue={modifyField?.renshu}
                        />
                        <ProFormDateTimeRangePicker
                            name="dateRange"
                            label="有效时间: "
                            width="md"
                            initialValue={modifyField ? [moment(`${modifyField?.startdate} ${modifyField?.starttime}`, "YYYY-MM-DD HH:mm"), moment(`${modifyField?.enddate} ${modifyField?.endtime}`, "YYYY-MM-DD HH:mm")] : null} fieldProps={{
                                format: "YYYY-MM-DD HH:mm",
                                placeholder: ["开始时间", "结束时间"]
                            }}
                        />
                        <ProFormText
                            name="orgType"
                            label="所属机构: "
                            placeholder="请输入疫苗所属机构"
                            width="md"
                            initialValue={modifyField?.orgType}
                        />
                        <ProFormText
                            name="batch"
                            label="接种批次: "
                            placeholder="请输入疫苗接种批次"
                            width="md"
                            initialValue={modifyField?.batch}
                        />
                    </>
                }
                {
                    selectKey === 3 &&
                    <>
                        <ProFormText
                            name="gelidianName"
                            label="场所名称: "
                            placeholder="场所名称文字描述"
                            width="md"
                            initialValue={modifyField?.gelidianName}
                        />
                        <ProFormText
                            name="gelidianPosition"
                            label="隔离地点（县/区、镇/街道）: "
                            placeholder="请输入隔离地点"
                            width="md"
                            initialValue={modifyField?.gelidianPosition}
                        />
                        <ProFormText
                            name="grlirenshu"
                            label="隔离人数: "
                            placeholder="请输入隔离人数"
                            width="md"
                            initialValue={modifyField?.grlirenshu}
                        />
                        <ProFormText
                            name="contact"
                            label="联系电话: "
                            placeholder="请输入联系电话"
                            width="md"
                            initialValue={modifyField?.contact}
                        />
                        <ProFormText
                            name="geliOrg"
                            label="所属机构: "
                            placeholder="请输入所属机构"
                            width="md"
                            initialValue={modifyField?.geliOrg}
                        />
                        <ProFormDateTimePicker
                            name="dateRange"
                            label="结束时间: "
                            width="md"
                            fieldProps={{
                                format: "YYYY-MM-DD HH:mm",
                            }}
                            initialValue={modifyField ? moment(modifyField?.enddate, "YYYY-MM-DD HH:mm") : null} />
                    </>
                }
                {
                    selectKey === 4 &&
                    <>
                        <p>轨迹上传: </p>
                        <Card>
                            <ProFormList
                                copyIconProps={{
                                    Icon: SnippetsOutlined,
                                }}
                                deleteIconProps={{
                                    Icon: DeleteOutlined,
                                }}
                                min={1}
                                max={10}
                                initialValue={
                                    modifyField?.guiji?.map((item) => ({
                                        name: item.guijiPosition,
                                        datetime: [item.starttime, item.endtime]
                                    }))
                                }
                                actionGuard={{
                                    beforeAddRow: async () => {
                                        return new Promise((resolve) => {
                                            setTimeout(() => resolve(true));
                                        });
                                    },
                                    beforeRemoveRow: async (index) => {
                                        return new Promise((resolve) => {
                                            if (index === 0) {
                                                resolve(false);
                                                return;
                                            }
                                            setTimeout(() => resolve(true));
                                        });
                                    },
                                }}
                                name="guijiArray"
                            >
                                <ProFormGroup>
                                    <ProFormText
                                        key="useMode"
                                        name="name"
                                        label="地点录入（县/区、镇/街道）："
                                        width="sm"
                                    />
                                    <ProFormDateTimeRangePicker
                                        name="datetime"
                                        label="时间录入: "
                                        width="md"
                                        fieldProps={{
                                            format: "YYYY-MM-DD HH:mm",
                                            placeholder: ["开始时间", "结束时间"]
                                        }}
                                    />
                                </ProFormGroup>
                            </ProFormList>
                        </Card>
                    </>
                }
            </ModalForm>
        </>
    )
}