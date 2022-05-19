import { SyncOutlined, MinusCircleOutlined} from '@ant-design/icons';
export const tagObject = {
    1: {
        color: "blue",
        label: "待审核"
    },
    2: {
        color: "green",
        label: "已通过"
    },
    3: {
        color: "red",
        label: "已驳回"
    },
}

export const statusObj = {
    1: {
        color: "blue",
        label: "运行中",
        icon: <SyncOutlined spin />
    },
    2: {
        color: "red",
        label: "已停止",
        icon: <MinusCircleOutlined />
    }
}

export const selectOptions = [
    {
        value: 1,
        label: '核酸检测',
    },
    {
        value: 2,
        label: '疫苗接种',
    },
    {
        value: 3,
        label: '隔离地点',
    },
    {
        value: 4,
        label: '轨迹上传',
    },
]

export const globalOptions = [
    {
        value: 0,
        label: '全部'
    },
    {
        value: 1,
        label: '核酸检测',
    },
    {
        value: 2,
        label: '疫苗接种',
    },
    {
        value: 3,
        label: '隔离地点',
    },
    {
        value: 4,
        label: '轨迹上传',
    },
]

export const tabList = [
        {
            key: 1,
            tab: '核酸检测'
        },
        {
            key: 2,
            tab: '疫苗接种'
        },
        {
            key: 3,
            tab: '隔离地点',
        },
        {
            key: 4,
            tab: '轨迹查询'
        }
    ]

export const serviceTypeObject = {
    1: "核酸检测",
    2: "疫苗接种",
    3: "隔离地点",
    4: "轨迹信息"
}

export const callbackFieldsKeys = {
    1: "hesuan",
    2: "yimiao", 
    3: "gelidian",
    4: "guiji"
}

export const callbackFieldsPositionKeys = {
    1: "hesuanPosition",
    2: "yimiaoPosition",
    3: "gelidianPosition",
    4: "guijiPosition"
}

export const callbackFieldsNameKeys = {
    1: "hesuanName",
    2: "yimaioName",
    3: "gelidianName",
    4: "guiji"
}


export const messageTab = [
    {
        tab: "全部",
        key: "-1"
    },
    {
        tab: "评论",
        key: "1"
    },
    {
        tab: "回复",
        key: "2"
    },
    {
        tab: "申请",
        key: "3"
    },
    {
        tab: "系统",
        key: "0"
    }
]

export const messageTabObj = {
    "0": "系统",
    "-1": "全部",
    "1": "评论",
    "2": "回复",
    "3":  "申请"
}

export const readObj = {
    0: "未读",
    1: "已读"
}


