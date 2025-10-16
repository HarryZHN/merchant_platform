// app.js
App({
  onLaunch: function () {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'merchant-platform-8evh3c5ab8de7a', // 替换为您的云环境ID
      traceUser: true
    })

    // 获取云数据库引用
    this.globalData.db = wx.cloud.database()
    
    // 获取用户信息
    this.getUserInfo()
    
    // 检查登录状态
    this.checkLoginStatus()
  },

  onShow: function () {
    // 小程序启动或切前台时执行
    console.log('小程序启动或切前台')
  },

  onHide: function () {
    // 小程序切后台时执行
    console.log('小程序切后台')
  },

  // 获取用户信息
  getUserInfo: function () {
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo
              // 发送 res.userInfo 到后台换取 openId, sessionKey, unionId
              that.login()
            }
          })
        }
      }
    })
  },

  // 登录
  login: function () {
    const that = this
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              that.globalData.openid = res.result.openid
              that.globalData.userInfo = that.globalData.userInfo || {}
              that.globalData.userInfo.openid = res.result.openid
              // 更新用户信息到数据库
              that.updateUserInfo()
            },
            fail: err => {
              console.error('调用登录云函数失败', err)
              // 在模拟环境下，可以设置一个模拟的openid
              that.globalData.openid = 'mock_openid_' + Date.now()
            }
          })
        } else {
          console.error('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 更新用户信息
  updateUserInfo: function () {
    const that = this
    const { openid, userInfo } = that.globalData
    
    if (!openid) return
    
    // 调用云函数更新用户信息
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        userInfo: userInfo
      },
      fail: err => {
        console.error('更新用户信息失败', err)
      }
    })
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const that = this
    const userInfo = wx.getStorageSync('userInfo')
    const openid = wx.getStorageSync('openid')
    
    if (userInfo && openid) {
      that.globalData.userInfo = userInfo
      that.globalData.openid = openid
    }
  },

  // 全局错误处理
  onError: function (error) {
    console.error('全局错误:', error)
    // 可以在这里上报错误信息到服务器
  },

  // 获取用户定位
  getUserLocation: function (callback) {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        callback && callback(res)
      },
      fail: err => {
        console.error('获取定位失败', err)
        // 默认北京坐标
        this.globalData.location = {
          latitude: 39.9042,
          longitude: 116.4074
        }
        callback && callback(this.globalData.location, true)
      }
    })
  },

  // 全局数据
  globalData: {
    userInfo: null,
    openid: null,
    location: null,
    db: null,
    // 是否是商家模式
    isMerchant: false,
    // 当前选中的商家
    currentMerchant: null,
    // 购物车数据
    cart: [],
    // 配置信息
    config: {
      pageSize: 20,
      appName: '多租户水果店'
    }
  }
})