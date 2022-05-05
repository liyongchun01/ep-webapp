import React, { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Button } from 'antd';
import MainMap from '@/components/MainMap';
import { tabList } from '@/configuration';
import { TextLoop } from 'react-text-loop-next';
import axios from 'axios';
import styles from './styles.less'

export default () => {
    const [key, setKey] = useState(1)
    const [newList, setNewList] = useState([])

    const getNewsList = async () => {
        const { data } = await axios.get("http://api.tianapi.com/ncov/index", {
            params: {
                key: "d334721cf6eba2d619a5855420ec352c"
            }
        })
        setNewList(data?.newslist[0].news)
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
                                    <Button type='link' key={item.id} href={item.sourceUrl}>{`${item.infoSource}(${item.pubDateStr}): ${item.summary}`}</Button>
                                ))}
                            />
                        }
                    />
                </>
            )
        }
    }

    return (
        <PageContainer
            tabList={tabList}
            onTabChange={(key) => setKey(key)}
            content={newsAlert()}
        >
            <Card>
                <MainMap type={+key} key={key} />
            </Card>
        </PageContainer>
    );
};
