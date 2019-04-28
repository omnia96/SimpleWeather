var QQMapWX = require('../../libs/qqmap-wx-jssdk')
const app = getApp()
Page({
  data: {
    weatherData:{},
    cityName: null,
    todayWeatherData: {},
    weekWeatherData: {},
    swiperCurrent:null,
    current: 'homepage',
    spinShow: true,
    switch: false,
    cityId:null,
    themes:"themes_light",
    weatherIcon: {
      "daxue": "Cumulus-Cloud-Snowflake",
      "dayu": "Cumulus-Cloud-Raindrop-2",
      "leizhenyu": "Cumulus-Cloud-Lightning-Sun-2",
      "mai": "Cumulus-Cloud-Fog",
      "qing": "Cumulus-Sun-2",
      "shachenbao": "Cumulus-Tornado",
      "wu": "Cumulus-Clouds-2",
      "xiaoyu": "Cumulus-Cloud-Rain-2",
      "yin": "Cumulus-Cloud-Sun-2",
      "yujiaxue": "Cumulus-Cloud-Snow-2",
      "yun": "Cumulus-Cloud-2",
      "zhongyu": "Cumulus-Cloud-Raindrop-2",
      "bingbao": "Cumulus-Cloud-Snow-2",
      "lei": "Cumulus-Cloud-Lightning-2",
      "shachen": "Cumulus-Tornado",
      "xue": "Cumulus-Cloud-Snow-2",
      "yu": "Cumulus-Cloud-Rain-2",
      "zhenyu": "Cumulus-Cloud-Raindrop-2"
    },
  },
onLoad:function(){
 
},
  handleChange({ detail }) {
    if (detail.key === "homepage"){
      this.onShow()
    }else{
      wx.switchTab({
        url:"../settings/settings"
      })
    }
  },
onShow:function(){
  // this.onLoad()
  wx.hideTabBar()
  var that = this
  that.setData({themes:app.globalData.themes})
  if(app.getCache("cache_weather_time_"+app.getCache("cityName"))){
    if(app.TimeDifference(app.getCache("cache_weather_time_"+app.getCache("cityName")),app.getCurrentTime())<90){
      var weatherData = []
      weatherData.push(app.getCache("cache_weather_"+app.getCache("cityName")))
      var cityList = app.getCache("userCityList")
      for(var i = 0 ;i<cityList.length;i++){
        weatherData.push(app.getCache("cache_weather_"+cityList[i].name))
      }
      that.setData({
        weatherData:weatherData,
        cityId:"default"
      })
      var time = setTimeout(function () {
        that.onSwitchChange()
      },1000)
      
      
      
    }else{
      var cityList = app.getCache("userCityList")
      that.getUserLocation(that.getUserCityName)
      for(var i = 0 ;i<cityList.length;i++){
        that.getOtherCity(cityList[i].id,cityList[i].name)
      }
    }
  }else{
    that.getUserLocation(that.getUserCityName)
  }
  // that.getCityList()
  this.setData({swiperCurrent:null})
},
onHide:function(){
  this.setData({swiperCurrent:0})
},
onReady:function(){
},
onSwiperChange:function(e){
  var that = this
  var cityId = []
  console.log(e.detail.current)
  cityId.push("default")
  var cityList = app.getCache("userCityList")
  for(var i = 0;i<cityList.length;i++){
    cityId.push(cityList[i].id)
  }
  console.log(cityId)
  that.setData({
    cityId:cityId[e.detail.current]
  })

},
onSwitchChange () {
  // const value = detail.value;
  this.setData({
      switch: true,
      spinShow: false
  });
},
  onShareAppMessage: function () {

  },
getOtherCity:function(id,name){
    var that = this
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v6&cityid=' + id,
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
        wx.request({
          url: 'https://www.tianqiapi.com/api/?version=v1&cityid='+id,
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
                "temperatureMax":res[i].tem1,
                "temperatureMin":res[i].tem2,
                "tips":res[i].index
              }
            }
            weekWeatherData[0].week = "今天"
            weekWeatherData[1].week = "明天"
            weekWeatherData[2].week = "后天"
      
            var weatherData = []
            if(app.getCache("cache_weatherData")){
              weatherData = that.data.weatherData
            }
            weatherData=({
              "name":name,
              "todayWeatherData":todayWeatherData,
              "weekWeatherData":weekWeatherData
            })
            that.setData({
              weatherData:weatherData
            })
            app.setCache("cache_weather_"+name,weatherData)
          }
        })
      }
    })
},
//获取位置
getUserLocation: function () {
  var parameters = arguments
  var that = this
  wx.getLocation({
    type: 'gcj02',
    success(res) {
      var res = {
        latitude: res.latitude,
        longitude: res.longitude
      }
      if (parameters[0]) {
        app.setCache("location", res)
        parameters[0](res)
      } else {
        app.setCache("locationNow", res)
      }
    }
  })
},
getUserCityName: function (location) {
  var parameters = arguments
  var that = this
  let qqmapsdk = new QQMapWX({
    key: 'QG2BZ-4OS3U-QNUVG-4RYJG-C54ZZ-3ZFCW'
  })
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: parameters[0].latitude,
      longitude: parameters[0].longitude
    },
    success: function (res) {
      var res = res.result.address_component;
      res = {
        province: res.province,
        city: res.city,
        district: res.district
      }
      console.log(res)
      var cityName = []
      cityName = that.fuzzyQuery(app.globalData.cityList, res.province, "provinceZh")
      cityName = that.fuzzyQuery(cityName, res.city, "leaderZh")
      cityName = that.fuzzyQuery(cityName, res.district, "cityZh")
      console.log(cityName)
      that.setData({
        cityName:cityName[0].leaderZh+" · "+cityName[0].cityZh
      })
      app.setCache("cityName",cityName[0].leaderZh+" · "+cityName[0].cityZh)
      app.setCache("cityId",cityName[0].id)
      that.setData({
        cityId:cityName[0].id
      })
      var cityId = cityName[0].id
      console.log(cityId)
      that.requireToday(cityId)
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {
      // console.log(res);
    }
  })

},
fuzzyQuery: function (array, keyWord, keyname) {
  var newArray = []
  var key = keyWord
  for (var i = 0; i <= keyWord.length; i++) {
    var arr = array.filter(function (item) {
      var reg = new RegExp(key)
      return reg.test(item[keyname])
    })
    if (arr != false) {
      newArray = arr
    } else {
      key = key.substr(0, key.length - 1)
    }
  }
  return newArray
},
requireToday: function (id) {
  var that = this
  wx.request({
    url: 'https://www.tianqiapi.com/api/?version=v6&cityid=' + id,
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
        date: res.date,
        alarm:res.alarm
      }
      that.requireWeek(id,todayWeatherData)
    }
  })
},
requireWeek: function (id,value) {
  let that = this
  wx.request({
    url: 'https://www.tianqiapi.com/api/?version=v1&cityid='+id,
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

      var weatherData = {
        "name":app.getCache("cityName"),
        "todayWeatherData":value,
        "weekWeatherData":weekWeatherData
      }
      var city = []
      city = app.getCache("userCityList")
      if(city.length > 0){
        var data = []
        data.push(weatherData)
        for(var i =0 ;i<city.length;i++){
          data.push(app.getCache("cache_weather_"+city[i].name))
        }
        that.setData({
          weatherData:data
        })
      }else{
        that.setData({
          weatherData:{0:weatherData}
        })
      }
      that.onSwitchChange()
      app.setCache("cache_weather_time_"+app.getCache("cityName"),app.getCurrentTime())
      app.setCache("cache_weather_"+app.getCache("cityName"),weatherData)
    }
  })
},
forwardTo: function (id) {
  wx.navigateTo({
    url: '../all/all?id='+id
  })
},
})