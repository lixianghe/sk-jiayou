import { throttle } from '../../../utils/util';
var detail = require('../../../behaviors/detail')
var detailCom = require('../detailCom')
const app = getApp()

Component({
  behaviors: [detail, detailCom],
  properties: {
    detail: {
      type: Object,
      default: {}
    },
    btns: {
      type: Array,
      default: []
    }
  },
  data: {
    
  },
  observers: {

  },
  attached: function () {

  },
  ready: function() {

  },
  detached: function () {

  },
  methods: {
    /**
     * 点击重新加载按钮
     */
    reloadData(res) {
      wx.showLoading({
        title: '加载中',
      });
      const vid = this.data.vid
      this.getDetail(vid);
    }
  }
})
