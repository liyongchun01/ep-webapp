import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import MainMap from '@/components/MainMap';
import { tabList } from '@/configuration';

//核酸检测页面
export default () => {
    const [key, setKey] = useState(1)

    const onTabChange = (key) => {
        setKey(key)
    }
    const lonLat = {
        1: [
            // 点标记数据数组
            {
                // 标记位置(纬度，经度，高度)
                x: 34.98210863924864,
                y: 117.31310899739151,
                id: 1
            }
        ],
        2: [
            // 点标记数据数组
            {
                // 标记位置(纬度，经度，高度)
                x: 34.98210863924864,
                y: 117.31310899739151,
                id: 1
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 33.98210863924864,
                y: 116.31310899739151,
                id: 2
            }
        ],
        3: [
            // 点标记数据数组
            {
                // 标记位置(纬度，经度，高度)
                x: 34.98210863924864,
                y: 117.31310899739151,
                id: 1
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 33.98210863924864,
                y: 116.31310899739151,
                id: 2
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 31.98210863924864,
                y: 116.31310899739151,
                id: 3
            },
        ],
        4: [
            // 点标记数据数组
            {
                // 标记位置(纬度，经度，高度)
                x: 34.98210863924864,
                y: 117.31310899739151,
                id: 1
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 33.98210863924864,
                y: 116.31310899739151,
                id: 2
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 31.98210863924864,
                y: 116.31310899739151,
                id: 3
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 34.99210863924864,
                y: 116.31310899739151,
                id: 4
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 32.98210863924864,
                y: 121.31310899739151,
                id: 5
            },
            {
                // 标记位置(纬度，经度，高度)
                x: 32.97210863924864,
                y: 120.31310899739151,
                id: 6
            },
        ]
    }
    return (
        <PageContainer
            tabList={tabList}
            onTabChange={onTabChange}
        >
            <Card>
                <MainMap type={+key} lngLat={lonLat} key={key} />
            </Card>
        </PageContainer>
    );
};
