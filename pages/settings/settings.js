// pages/settings/settings.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'setuppage',
    userCityList: [],
    themes:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  TabBarSwich({
    detail
  }) {
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
  onLoad: function (options) {
    var that = this
    that.setData({themes:app.globalData.themes})
    console.log(app.getCache("userCityList"))
    that.setData({
      userCityList: app.getCache("userCityList")
    })
  },
  delete: function (e) {
    console.log("Delete")
    console.log(e.target.id)
    var userCityList = app.getCache("userCityList")
    app.removeCache("cache_weather_" + userCityList[e.target.id].name)
    app.removeCache("cache_time_more_"+ userCityList[e.target.id].id)
    app.removeCache("cache_more_"+ userCityList[e.target.id].id)
    userCityList.splice(e.target.id, 1)
    app.setCache("userCityList", userCityList)


    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
    wx.hideTabBar()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})