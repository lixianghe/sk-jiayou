const app = getApp();

Component({
  properties: {
    code: String, // 0 正常 1 无数据 2 网络异常 3 服务器异常 4 请求失败,
    isFull: Boolean
  },
  data: {
    colorStyle: app.globalData.theme.colorStyle,
    backgroundColor: app.globalData.backgroundColor, // 页面的背景色
  },
  methods: {
    // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
    attached: function () {
      app.setTheme(this);
    },
    viewOil() {
      this.triggerEvent('toHome');
    },
    reload(e) {
      // app.log("----点击了重新加载------"+this.properties.code)
      this.triggerEvent('refresh');
    },
    reset() {
      this.triggerEvent('reset');
    }
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function () {
    app.setTheme(this);
  },
});