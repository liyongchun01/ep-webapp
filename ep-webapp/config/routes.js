export default [
  {
    path: '/upload-ep-info',
    name: '上传防疫信息',
    icon: 'CloudUploadOutlined',
    component: './UploadInfo',
  },
  {
    path: '/upload-management',
    name: '上传管理',
    icon: 'RadarChartOutlined',
    access: 'canAdmin',
    component: './UserManagement',
  },
  {
    name: '定时任务',
    icon: 'HistoryOutlined',
    path: '/timed-task',
    component: './TimedTask',
  },
  {
    name: '博客',
    icon: 'AlignLeftOutlined',
    path: '/blog',
    component: './Blog',
  },
  {
    name: '消息',
    icon: 'CommentOutlined',
    path: '/message',
    component: './MyMessage',
  },
  {
    name: '疫情地图',
    icon: 'FundOutlined',
    path: '/map-service',
    component: './EpMap',
  },
  {
    name: '注册/登录',
    icon: 'UserAddOutlined',
    path: '/user-register',
    component: './Register',
  },
  {
    path: '/',
    redirect: '/upload-ep-info',
  },
  {
    component: './404',
  },
];
