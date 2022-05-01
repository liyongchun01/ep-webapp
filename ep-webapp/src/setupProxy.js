// const { createProxyMiddleware } = require('http-proxy-middleware');
// module.exports = function (app) {
//     app.use(
//         '/ws',
//         createProxyMiddleware({
//             target: 'https://eyesight.news.qq.com/',
//             changeOrigin: true,
//             pathRewrite: {
//                 '^/api': '',
//             }
//         })
//     );
//     app.use(
//         '/apc',
//         createProxyMiddleware({
//             target: 'https://api.inews.qq.com/',
//             changeOrigin: true,
//             pathRewrite: {
//                 '^/apc': '',
//             }
//         })
//     );
// };
 