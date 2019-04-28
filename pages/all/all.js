// pages/index/index.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather:Object,
    current:'index',
    spinShow: true,
    switch: false,
    themes:"themes_light",
    weatherIcon:{
      "daxue":"Cumulus-Cloud-Snowflake",
      "dayu":"Cumulus-Cloud-Raindrop-2",
      "leizhenyu":"Cumulus-Cloud-Lightning-Sun-2",
      "mai":"Cumulus-Cloud-Fog",
      "qing":"Cumulus-Sun-2",
      "shachenbao":"Cumulus-Tornado",
      "wu":"Cumulus-Clouds-2",
      "xiaoyu":"Cumulus-Cloud-Rain-2",
      "yin":"Cumulus-Cloud-Sun-2",
      "yujiaxue":"Cumulus-Cloud-Snow-2",
      "yun":"Cumulus-Cloud-2",
      "zhongyu":"Cumulus-Cloud-Raindrop-2",
      "bingbao":"Cumulus-Cloud-Snow-2",
      "lei":"Cumulus-Cloud-Lightning-2",
      "shachen":"Cumulus-Tornado",
      "xue":"Cumulus-Cloud-Snow-2",
      "yu":"Cumulus-Cloud-Rain-2",
      "zhenyu":"Cumulus-Cloud-Raindrop-2"
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getWeatherData()
    wx.hideTabBar()
    console.log(options)
    let that = this
    that.setData({themes:app.globalData.themes})
    let cache = app.getCache('cache_more_'+options.id)
        let timeNow = app.getCurrentTime()
        if (cache.time) {
            let timeDifference = app.TimeDifference(cache.time,timeNow)
            if (timeDifference<=720) {
                that.setData({
                  weather:cache.data
                })
                var time = setTimeout(function () {
                  that.onSwitchChange()
                },1000)    
            } else {
              that.getWeatherData(options.id)
            }
        } else {
          that.getWeatherData(options.id)
        }
  },
  onUnLoad:function(){
    that.onSwitchChange()
  },
  onSwitchChange () {
    // const value = detail.value;
    this.setData({
        switch: true,
        spinShow: false
    });
  },
  getWeatherData: function (id) {
    let that = this
    if(id == "default"){
      wx.request({
        url: 'https://www.tianqiapi.com/api/?version=v3&appid=06369426&appsecret=VVM7jMR0&cityid='+app.getCache("cityId"),
        // url:'https://www.tianqiapi.com/api/',
        data: {},
        header: {},
        success(res) {
          console.log(res.data)
          that.setData({
            weather: res.data
          })
          that.onSwitchChange()
          let value = that.data.weather
          
          app.setCache('cache_more_default',{"time":app.getCurrentTime(),"data":value})
          
        }
      })
    }else{
      wx.request({
        url: 'https://www.tianqiapi.com/api/?appid=06369426&appsecret=VVM7jMR0&version=v3&cityid='+id,
        data: {},
        header: {},
        success(res) {
          console.log(res.data)
          that.setData({
            weather: res.data
          })
          that.onSwitchChange()
          console.log(that.data.weather)
          let value = that.data.weather
          app.setCache('cache_more_'+id,{"time":app.getCurrentTime(),"data":value})
          
        }
      }) 
    }
    
  }
})