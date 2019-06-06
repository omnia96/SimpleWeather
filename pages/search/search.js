var WxSearch = require('../../libs/wxSearch/wxSearch.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaderList:null,
    themes:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      themes:app.globalData.themes
    })
    console.log(app.globalData.cityList)
    var leaderList = []

    for (var i = 0; i < app.globalData.cityList.length; i++) {
      for (var j = i+1; j < app.globalData.cityList.length; j++) {
        if(app.globalData.cityList[i].leaderZh===app.globalData.cityList[j].leaderZh){
          ++i;
        }
      }
      leaderList.push(app.globalData.cityList[i].leaderZh);
    }
    // console.log(leaderList)
    // console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that,43,['weappdev','小程序','wxParse','wxSearch','wxNotification'],false,false)
    // var mindKeys = app.globalData.cityList
    WxSearch.initMindKeys(leaderList)
  },
  getCity:function(value){
    var that = this
    console.log(value.target.dataset.key)
    var leaderList = []
    for (var i = 0; i < app.globalData.cityList.length; i++) {
      for (var j = i+1; j < app.globalData.cityList.length; j++) {
        if(app.globalData.cityList[i].leaderZh===app.globalData.cityList[j].leaderZh){
          ++i;
        }
      }
      leaderList.push(app.globalData.cityList[i]);
    }

    var arr = leaderList.filter(function(item){
      var reg = new RegExp(value.target.dataset.key)
      return reg.test(item["leaderZh"])
    })
    arr = {"name":arr[0].leaderZh,"id":arr[0].id}
    if(app.getCache("userCityList")){
      var userCityList = []
      userCityList= app.getCache("userCityList")
      console.log(userCityList)
      userCityList.push(arr)
      console.log(userCityList)
      app.setCache("userCityList",userCityList)
      that.requireToday(arr.id,arr.name)
      wx.navigateBack({
        delta: 1
      })
    }else{
      app.setCache("userCityList",[])
    }
    
    
    console.log( app.getCache("userCityList"))
  },
  requireToday: function (id,name) {
    var that = this
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v61&appid=06369426&appsecret=VVM7jMR0&cityid=' + id,
      // url:'https://www.tianqiapi.com/api/',
      data: {},
      header: {},
      success(res) {
        console.log(res.data)
        var res = res.data
        var todayWeatherData = {
          weather: res.wea,
          weatherIcon: res.wea_img,
          wind: res.win,
          temperature: res.tem,
          humidity: res.humidity,
          visibility: res.visibility,
          airLevel: res.air_level,
          airTips: res.air_tips,
          week: res.week,
          date: res.date
        }
        that.requireWeek(id,name,todayWeatherData)
      }
    })
  },
  requireWeek: function (id,name,value) {
    let that = this
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v9&appid=06369426&appsecret=VVM7jMR0&cityid='+id,
      success(res) {
        console.log(res)
        var res = res.data.data
        console.log(res)
        var weekWeatherData = []
        for(var i = 0;i<7;i++){
          weekWeatherData[i] = {
            "week":res[i].week,
            "weather":res[i].wea,
            "weatherIcon":res[i].wea_img,
            "temperatureMax": res[i].tem1,
            "temperatureMin": res[i].tem2,
            "tips":res[i].index
          }
        }
        weekWeatherData[0].week = "今天"
        weekWeatherData[1].week = "明天"
        weekWeatherData[2].week = "后天"
  
        var weatherData = []
        weatherData = {
          "name":name,
          "todayWeatherData":value,
          "weekWeatherData":weekWeatherData
        }
        app.setCache("cache_weather_"+name,weatherData)
        // app.setCache("cache_weather_time"+name,app.getCurrentTime)
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  wxSearchFn: function(e){
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    console.log("wxSearchFn")
  },
  wxSearchInput: function(e){
    var that = this
    WxSearch.wxSearchInput(e,that);
    //输入
  },
  wxSerchFocus: function(e){
    var that = this
    WxSearch.wxSearchFocus(e,that);
    //打开搜索面板
  },
  wxSearchBlur: function(e){
    var that = this
    WxSearch.wxSearchBlur(e,that);
    //点击
  },
  wxSearchKeyTap:function(e){
    var that = this
    WxSearch.wxSearchKeyTap(e,that);
  },
  wxSearchDeleteKey: function(e){
    var that = this
    WxSearch.wxSearchDeleteKey(e,that);
  },
  wxSearchDeleteAll: function(e){
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e){
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
    that.getCity(e)
  }
})