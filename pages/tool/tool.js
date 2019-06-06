// pages/tool/tool.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:"tool",
    themes: "themes_light",
    AppList:[
      {
      appId:"wx0d472828051d3e51",
      path:"pages/index/index",
      title:"快递单号查询小帮手",
      subtitle:"快递查询单号查询,支持全国700多家快递查询,圆通快递,韵达快递,中通快递,申通快递,EMS快递,邮政快递等",
      logo:"https://www.weixin6.com/web/repositories/logo/wx0d472828051d3e51.png"
    },
    {
      appId:"wx2c6faff0599f504c",
      path:"pages/index/index",
      title:"万年历查询",
      subtitle:"万年历查询，日历查询",
      logo:"https://www.weixin6.com/web/repositories/logo/wx2c6faff0599f504c.png"
    },
    {
      appId:"wx7179cdde0aa60224",
      path:"pages/index/index",
      title:"今日限行尾号",
      subtitle:"限行，北京，杭州，成都，深圳...",
      logo:"https://www.weixin6.com/web/repositories/logo/wx7179cdde0aa60224.png"
    },
    {
      appId:"wx33f43967ea31e04e",
      path:"pages/index/index",
      title:"列车时刻表助手",
      subtitle:"列车时刻表，车次查询...",
      logo:"https://www.weixin6.com/web/repositories/logo/wx33f43967ea31e04e.png"
    },
    {
      appId:"wx8ae487c1839c9fee",
      path:"pages/index/index",
      title:"驾驶证违章查询",
      subtitle:"驾驶证扣分，车辆违章查询...",
      logo:"https://www.weixin6.com/web/repositories/logo/wx8ae487c1839c9fee.png"
    },
    {
      appId:"wxc7b56d5f7d6c8898",
      path:"pages/index/index",
      title:"发票真伪查询助手",
      subtitle:"发票真伪查询助手...",
      logo:"https://www.weixin6.com/web/repositories/logo/wxc7b56d5f7d6c8898.png"
    },
    {
      appId:"wxff032bc0b05046bd",
      path:"pages/index/index",
      title:"Pure 计算器",
      subtitle:"数学，一个人买60个西瓜的唯一解释...",
      logo:"https://www.weixin6.com/web/repositories/logo/wxff032bc0b05046bd.png"
    }
  ]

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  ToOtherApp(e){
    let app = e.currentTarget.dataset.value
    wx.navigateToMiniProgram({
      appId: app.appId,
      path: app.path,
      extraData: {},
      envVersion: 'release',
      success: function success(res) {
        console.log("调用成功");
      }
    })
  },
  TabBarSwich({detail}) {
    let current = this.data.current
    switch (detail.key) {
      case "homepage":
        if (detail.key == current) {
          this.onShow()
        } else {
          wx.switchTab({
            url: "../index/index"
          })
        }
        break;

      case "setuppage":
        if (detail.key == current) {
          this.onShow()
        } else {
          wx.switchTab({
            url: "../settings/settings"
          })
        }
        break;

      case "tool":
        if (detail.key == current) {
          this.onShow()
        } else {
          wx.switchTab({
            url: "../tool/tool"
          })
        }
        break;

      default:
        this.onShow()
        break;
    }
  },
})