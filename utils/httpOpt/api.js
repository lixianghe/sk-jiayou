import { request, apiFormat } from './https'

// 基于地理位置获取周边加油站
const getOilApi = '/scene/wecar/scene/access/onlinerefuel'                                      // get
// 加油站详情
const getOilInfoApi = '/scene/wecar/scene/access/getcustomqrcode'                           // get

export const getOil = (data) => request(getOilApi, data, 'POST')
export const getOilInfo = (data) => request(getOilInfoApi, data, 'POST')

