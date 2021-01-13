const base = 'https://gw.tai.qq.com'
// const base = 'https://tapi.kaishustory.com'
const appkey = 'AGLU6H05'
import md from '../md5'
/**
 * 封封微信的的request
 */

export function request(url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    data.appKey = appkey
    data.seqId = get_id(8)
    let sign = sort_ASCII(data)
    let _data = Object.assign({}, data)
    _data.sign = sign
    wx.request({
      url: base + url,
      data: _data,
      method: method,
      dataType: 'json',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.errcode === 0) {
            resolve(res.data)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
            reject(res.data.message)
            
          }
        } else {
          reject(res.data.message)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

export const apiFormat = (str, res) => {
  let reg = /\{(\w+?)\}/gi
  return str.replace(reg, ($0, $1) => {
    return res[$1]
  })
}


function sort_ASCII(obj){
  var arr = new Array();
  var num = 0;
  for (var i in obj) {
    arr[num] = i;
    num++;
  }
  var sortArr = arr.sort();
  var sortObj = {};
  for (var i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  let strObj = ''
  for(let key in sortObj) {
    strObj += `${key}=${sortObj[key]}&`
  }
  strObj = md(strObj.substr(0, strObj.length - 1))
  return strObj;
}

function get_id(length){
  return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
}
