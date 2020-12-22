// 域名
// 测试环境
const domain = {
  'test': 'https://api-cmp.web3do.com', // 测试环境
  'prod': 'https://api-cmp.wecar.map.qq.com' // 生产环境
};
// 正式环境
// const domain = 'https://api-cmp.wecar.map.qq.com/api/movie/v1'

const api = {
  // 视频列表
  videoList: '/api/movie/v1/nearby',
  // 视频详情
  videoDetail: '/api/movie/v1/detail'
};
const log = 'https://api-cmp.web3do.com/api/log/v1/controllerlog';

exports.api = api;
exports.domain = domain;
exports.logUrl = log;
