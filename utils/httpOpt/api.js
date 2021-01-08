import { request, apiFormat } from './https'

// 基于地理位置获取周边加油站
const getOilApi = '/scene/wecar/scene/access/onlinerefuel'                                      // get
// 校验用户状态信息
const checkStatusApi = '/open/user/check/status'                           // get

export const getOil = (data) => request(getOilApi, data, 'POST')
export const checkStatus = (params) => request(checkStatusApi, params)

