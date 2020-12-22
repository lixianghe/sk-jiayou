const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // eslint-disable-next-line max-len
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
// 防抖防止多次触发
function throttle (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }
  let _lastTime = null;
  return function () {
    const _nowTime = +new Date();

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      _lastTime = _nowTime;
      fn.apply(this, arguments);
    }
  };
}
module.exports = {
  formatTime: formatTime,
  throttle: throttle
};
