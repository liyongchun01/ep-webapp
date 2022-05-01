import { LoginForm, ProFormText } from '@ant-design/pro-form';
import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { history } from 'umi';

export default () => {
    const [loginType, setLoginType] = useState('login');
    const [isSame, setIsSame] = useState(false)

    // 登录方法
    const loginMethod = async ({ username, password }) => {
        await axios.get(`/api/login/admin`, {
            params: {
                username,
                password
            }
        }).then((res) => {
            console.log(res)
            if (res.status === 'ok') {
                message.success('登录成功')
                history.push('/index')
            }
        }).catch((err) => {
            console.log(err)
            message.error('登陆失败')
        })
    }

    // 验证是否存在此用户方法
    const getUserName = async ({ nickname }) => {
        await axios.get(`/api/user/getuname`, {
            params: {
                username: nickname
            }
        }).then((res) => {
            if (res === 1) {
                message.error('该账户已存在')
                return
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 注册方法
    const registerMethod = async (data) => {
        await getUserName(data)
        await axios.get(`/api/user/add`, {
            params: {
                nickname: data.nickname,
                password: data.againPassword
            }
        }).then((res) => {
            console.log(res)
            setLoginType("login")
        }).catch((err) => {
            console.log(err)
            message.error('注册失败')
        })
    }

    const onFinish = async (val) => {
        console.log(val)
        if (loginType === "register" && val.newPassword !== val.againPassword) {
            setIsSame(true)
            return
        }
        if (loginType === "login") {
            await loginMethod(val)
        } else {
            await registerMethod(val)
        }
    }

    return (
        <PageContainer>
            <div style={{ backgroundColor: 'white', height: '600px', paddingTop: '50px' }} >
                <LoginForm
                    logo='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
                    title="便民战疫"
                    subTitle="疫情防控排查服务平台"
                    onFinish={onFinish}
                >
                    <Tabs activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)}>
                        <Tabs.TabPane key={'login'} tab={'登录'} />
                        <Tabs.TabPane key={'register'} tab={'注册'} />
                    </Tabs>
                    {loginType === 'login' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'请输入用户名'}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                hasFeedback
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'register' && (
                        <>
                            <ProFormText
                                name="nickname"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                hasFeedback
                                placeholder={'请输入用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="newPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                hasFeedback
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="againPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'请再次输入密码'}
                                hasFeedback
                                help={isSame ? '两次密码输入不一致' : null}
                                rules={[
                                    {
                                        required: true,
                                        message: '请再次输入密码！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {/* <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码
                        </a>
                    </div> */}
                </LoginForm>
            </div>
        </PageContainer >
    );
};