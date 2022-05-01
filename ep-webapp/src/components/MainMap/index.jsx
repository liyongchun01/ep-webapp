import React, { useEffect, useRef } from 'react'
import * as mapUtils from '@/components/TMapGL'
import axios from 'axios';
import markerLogo from './img/markerLogo.png'

const searchObj = {
    1: "核酸",
    2: "疫苗",
    3: "隔离",
    4: "轨迹"
}

export default ({ lngLat, type }) => {
    const mapId = useRef() //  地图实例

    useEffect(() => {
        mainMap()
    }, [type])

    // 节流函数
    const throttle = (fn, time) => {
        let lasttime = 0;
        return () => {
            let nowtime = Date.now();
            if (nowtime - lasttime > time) {
                fn.call(this);
                lasttime = nowtime;
            }
        }
    }

    // 防抖开始
    const debounce = (fn, delay) => { // fn -> showTop函数; delay延时时间
        let t = null;
        return function () {
            if (t !== null) {
                clearTimeout(t);
            }
            t = setTimeout(() => {
                fn.call(this);
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

                const ipLocation = new TMap.service.IPLocation();
                const marker = new TMap.MultiMarker({
                    map: map,
                    styles: {
                        //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                        "centerStyle": new TMap.MarkerStyle({
                            "width": 32,  // 点标记样式宽度（像素）
                            "height": 32, // 点标记样式高度（像素）
                            "src": markerLogo,  //图片路径
                            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                            "anchor": { x: 16, y: 32 }
                        })
                    },
                    geometries: lngLat[type]?.map((item) => (
                        {
                            id: item.id,
                            position: formatLatLng(item.x, item.y)
                        }
                    )),
                });

                // 定位
                const locate = () => {
                    const ipInput = document.getElementById('ipInput').value;
                    const params = ipInput ? { ip: ipInput } : {};
                    ipLocation
                        .locate(params)
                        .then((result2) => {
                            // 未给定ip地址则默认使用请求端的ip
                            let { result } = result2;
                            marker.updateGeometries([
                                {
                                    id: 'main',
                                    styleId: 'centerStyle',
                                    position: result.location, // 将所得位置绘制在地图上
                                },
                            ]);
                            map.setCenter(result.location);
                            document.getElementById(
                                'ipLocationResult'
                            ).innerText = `您的IP/您输入的IP所在位置: ${result.ad_info.nation}, ${result.ad_info.province}`;
                        })
                        .catch((error) => {
                            document.getElementById(
                                'ipLocationResult'
                            ).innerText = `错误：${error.status}, ${error.message}`;
                        });
                }

                locate();
                const infoWindowList = Array(10);
                // const search = new TMap.service.Search({ pageSize: 10 })

                const getLocationList = async ({ dbWeiDu, dbJingDu, xnWeiDu, xnJingDu }) => {
                    await axios.get(`http://localhost:8083/map/index`, {
                        params: {
                            dbWeiDu,
                            dbJingDu,
                            xnWeiDu,
                            xnJingDu
                        }
                    }).then(({ data }) => {
                        // console.log(data)
                        data[type]?.forEach((item, index) => {
                            console.log(item)
                            const infoContent = {
                                1: {
                                    content: `  核酸检测信息 <br/> <h3>${item.hesuanPosition}</h3> ${item.hesuanName} <br/> 工作时间：${item.starttime} - ${item.endtime} <br /> 最新时间: ${item.area} 人数: ${item.renshu}`,
                                },
                                2: {
                                    content: `  疫苗接种信息 <br/> <h3>${item.yimiaoPosition}</h3> ${item.yimaioName} <br/>工作时间：${item.starttime} - ${item.endtime}  <br/>所属机构：${item.orgType} <br/> 第${item.batch}批次 <br /> 最新时间: ${item.area} 人数: ${item.renshu}`,
                                },
                                3: {
                                    content: ` 隔离地点信息 <br/>  <h3>${item.gelidianPosition}</h3> ${item.gelidianName} <br/>所属机构：${item.geliOrg} <br /> 最新时间: ${item.area} 隔离人数: ${item.grlirenshu} <br /> 联系电话${item.contact}`,
                                },
                                4: {
                                    content: ` 排查确诊者轨迹信息 <br/> <h3>${item.guijiPosition}</h3>  时间：${item.starttime} - ${item.endtime}`,
                                }
                            }
                            const geometries = marker.getGeometries();
                            const infoWindow = new TMap.InfoWindow({
                                map: map,
                                position: formatLatLng(item.weidu, item.jindu),
                                ...infoContent[type],
                                offset: { x: 0, y: -50 },
                            }); // 新增信息窗体显示地标的名称与地址、电话等信息
                            infoWindow.close();
                            infoWindowList[index] = infoWindow;
                            geometries.push({
                                id: String(index), // 点标注数据数组
                                position: formatLatLng(item.weidu, item.jindu),
                            });
                            console.log(type)
                            marker.updateGeometries(geometries); // 绘制地点标注
                            marker.on('click', (e) => {
                                let a = e.geometry.id
                                if (isNaN(+e.geometry.id)) {
                                    a = a.split("-")[0]
                                }
                                infoWindowList[Number(a)]?.open();
                            }); // 点击标注显示信息窗体
                        });
                    });
                }

                map.on("bounds_changed", debounce(() => {
                    const mapCenter = map.getCenter(); //获取地图中心点坐标          
                    const mapBounds = map.getBounds(); //获取当前地图的视野范围
                    const rangeObj = {}
                    if (mapBounds) {
                        rangeObj.mapCenter = [mapCenter.lat, mapCenter.lng]
                        rangeObj.dbWeiDu = +mapBounds.getNorthEast().getLat().toFixed(6)
                        rangeObj.dbJingDu = +mapBounds.getNorthEast().getLng().toFixed(6)
                        rangeObj.xnWeiDu = +mapBounds.getSouthWest().getLat().toFixed(6)
                        rangeObj.xnJingDu = +mapBounds.getSouthWest().getLng().toFixed(6)
                    }
                    getLocationList(rangeObj)
                }, 500))

                mapId.current = map //存储当前的map
            })
    }

    return (
        <>
            <div id='container'></div>
            <div id="panel" style={{ display: 'none' }}>
                <p><input type='text' id='ipInput' placeholder="输入IP地址(默认为请求端的IP)" size='30' /><input type='button' id='locate'
                    value='搜索所在位置' /></p>
                <p id="ipLocationResult"></p>
            </div>
        </>
    );
};