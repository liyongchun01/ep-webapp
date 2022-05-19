import React, { useEffect, useRef, useState } from 'react'
import * as mapUtils from '@/components/TMapGL'
import { history } from 'umi';
import axios from 'axios'
import { Spin } from 'antd'

export default ({ type }) => {
    const [isLoading, setIsloading] = useState(true)
    const mapId = useRef() //  地图实例

    useEffect(() => {
        mainMap()
    }, [type])

    // 防抖函数
    const debounce = (fn, delay) => {
        let t = null
        return function () {
            if (t !== null) {
                clearTimeout(t)
            }
            t = setTimeout(() => {
                fn.call(this)
            }, delay)
        }
    }

    const mainMap = () => {
        mapUtils
            .TMapGL() // 开始加载腾讯地图gl文件
            .then(() => { // 完成加载后，开始渲染地图
                const formatLatLng = (x, y) => (new TMap.LatLng(x, y))
                const map = new TMap.Map('container', {
                    center: new TMap.LatLng(40.0402718, 116.2735831),//设置地图中心点坐标
                    zoom: 12,   //设置地图缩放级别
                    pitch: 0,  //设置俯仰角
                    rotation: 0    //设置地图旋转角度
                })

                // 定位
                const ipLocation = new TMap.service.IPLocation()
                ipLocation
                    .locate()
                    .then(({ result }) => {
                        map.setCenter(result.location)
                    })

                const infoWindowList = Array(10)

                window.getBehaviorInfo = (params) => {
                    params = JSON.parse(params)
                    history.push({
                        pathname: '/blog',
                        query: {
                            type: params.type,
                            orderId: params.orderId,
                            typeId: params.typeId
                        },
                    });
                }

                const infoContent = (item) => {
                    const info = {
                        1: {
                            content: `  核酸检测信息 <br/> <h3>${item.hesuanPosition}</h3> ${item.hesuanName} <br/> 工作时间：${item.starttime} - ${item.endtime} <br /> 最新时间: ${item.area} 人数: ${item.renshu} <br/> <a onClick=getBehaviorInfo(\`${JSON.stringify(item)}\`)>博客</a>`,
                        },
                        2: {
                            content: `  疫苗接种信息 <br/> <h3>${item.yimiaoPosition}</h3> ${item.yimaioName} <br/>工作时间：${item.starttime} - ${item.endtime}  <br/>所属机构：${item.orgType} <br/> 第${item.batch}批次 <br /> 最新时间: ${item.area} 人数: ${item.renshu} <br/> <a onClick=getBehaviorInfo(\`${JSON.stringify(item)}\`)>博客</a>`,
                        },
                        3: {
                            content: ` 隔离地点信息 <br/>  <h3>${item.gelidianPosition}</h3> ${item.gelidianName} <br/>所属机构：${item.geliOrg} <br /> 最新时间: ${item.area} 隔离人数: ${item.grlirenshu} <br /> 联系电话${item.contact} <br/> <a onClick=getBehaviorInfo(\`${JSON.stringify(item)}\`)>博客</a>`,
                        },
                        4: {
                            content: ` 排查确诊者轨迹信息 <br/> <h3>${item.guijiPosition}</h3>  时间：${item.starttime} - ${item.endtime} <br/> <a onClick=getBehaviorInfo(\`${JSON.stringify(item)}\`)>博客</a>`,
                        }
                    }
                    return info
                }

                const getLocationList = async ({ dbWeiDu, dbJingDu, xnWeiDu, xnJingDu }) => {
                    setIsloading(true)
                    const markerCluster = new TMap.MarkerCluster({
                        map: map,
                        enableDefaultStyle: true, // 启用默认样式
                        minimumClusterSize: 2, // 形成聚合簇的最小个数
                        geometries: [],
                        zoomOnClick: false, // 点击簇时放大至簇内点分离
                        gridSize: 60, // 聚合算法的可聚合距离
                        averageCenter: true, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
                        maxZoom: 10, // 采用聚合策略的最大缩放级别
                    });
                    const { data } = await axios.get(`http://localhost:8083/map/index`, {
                        params: {
                            dbWeiDu,
                            dbJingDu,
                            xnWeiDu,
                            xnJingDu
                        }
                    })
                    setIsloading(false)
                    data[type]?.forEach((item, index) => {
                        const geometries = markerCluster.getGeometries()
                        const infoWindow = new TMap.InfoWindow({
                            map: map,
                            position: formatLatLng(item.weidu, item.jindu),
                            offset: { x: 0, y: -50 },
                            id: item.id
                        }) // 新增信息窗体显示地标的名称与地址、电话等信息
                        infoWindow.close()
                        infoWindow.setZIndex(1)
                        infoWindowList[index] = infoWindow
                        geometries.push({
                            id: String(index), // 点标注数据数组
                            position: formatLatLng(item.weidu, item.jindu),
                        })
                        markerCluster.updateGeometries(geometries) // 绘制地点标注
                        map.on("click", () => {
                            infoWindow.close()
                        })
                        markerCluster.on('click', ({ cluster }) => {
                            let formatId = cluster.geometries[0].id
                            if (isNaN(+formatId)) {
                                formatId = formatId.split("-")[0]
                            }
                            if (+formatId === index) {
                                infoWindowList[Number(formatId)]?.setContent(
                                    infoContent(item)[type].content
                                )
                            }
                            infoWindow.close()
                            infoWindowList[Number(formatId)]?.open()
                        })
                    })
                }

                map.on("bounds_changed", debounce(() => {
                    const mapCenter = map.getCenter() //获取地图中心点坐标
                    const mapBounds = map.getBounds() //获取当前地图的视野范围
                    const rangeObj = {}
                    if (mapBounds) {
                        rangeObj.mapCenter = [mapCenter.lat, mapCenter.lng]
                        rangeObj.dbWeiDu = +mapBounds.getNorthEast().getLat().toFixed(6)
                        rangeObj.dbJingDu = +mapBounds.getNorthEast().getLng().toFixed(6)
                        rangeObj.xnWeiDu = +mapBounds.getSouthWest().getLat().toFixed(6)
                        rangeObj.xnJingDu = +mapBounds.getSouthWest().getLng().toFixed(6)
                    }
                    const zoom = map.getZoom()
                    if (zoom >= 10) {
                        getLocationList(rangeObj)
                    }
                }, 500))
                mapId.current = map //存储当前的map
            })
    }

    return (
        <>
            <Spin spinning={isLoading}>
                <div id='container'></div>
            </Spin>
        </>
    )
}