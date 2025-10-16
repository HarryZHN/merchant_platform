// 商家登录页面逻辑
Page({
  data: {
    username: '',
    password: '',
    rememberPassword: false,
    loading: false
  },

  onLoad: function () {
    // 检查是否有记住的密码
    const savedUsername = wx.getStorageSync('merchantUsername')
    const savedPassword = wx.getStorageSync('merchantPassword')
    
    if (savedUsername && savedPassword) {
      this.setData({
        username: savedUsername,
        password: savedPassword,
        rememberPassword: true
      })
    }
  },

  // 用户名输入
  onUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 切换记住密码
  toggleRememberPassword: function () {
    this.setData({
      rememberPassword: !this.data.rememberPassword
    })
  },

  // 忘记密码
  forgotPassword: function () {
    wx.showToast({
      title: '请联系管理员重置密码',
      icon: 'none'
    })
  },

  // 登录
  login: function () {
    const { username, password } = this.data
    
    // 简单的表单验证
    if (!username.trim()) {
      wx.showToast({
        title: '请输入商家账号',
        icon: 'none'
      })
      return
    }
    
    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    
    this.setData({ loading: true })
    
    // 调用云函数进行登录验证
    wx.cloud.callFunction({
      name: 'merchantAuth',
      data: {
        action: 'login',
        username: username,
        password: password
      }
    }).then(res => {
      this.setData({ loading: false })
      
      if (res.result.success) {
        // 登录成功
        const merchantInfo = res.result.merchantInfo
        
        // 保存登录状态
        wx.setStorageSync('merchantLoginStatus', true)
        wx.setStorageSync('merchantInfo', merchantInfo)
        
        // 记住密码
        if (this.data.rememberPassword) {
          wx.setStorageSync('merchantUsername', username)
          wx.setStorageSync('merchantPassword', password)
        } else {
          wx.removeStorageSync('merchantUsername')
          wx.removeStorageSync('merchantPassword')
        }
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        // 跳转到商家后台首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/merchant/dashboard/dashboard'
          })
        }, 1500)
      } else {
        // 登录失败
        wx.showToast({
          title: res.result.message || '登录失败，请检查账号密码',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.error('登录失败', err)
      this.setData({ loading: false })
      
      wx.showToast({
        title: '登录失败，请稍后重试',
        icon: 'none'
      })
    })
  },

  // 跳转到注册页面
  goToRegister: function () {
    wx.navigateTo({
      url: '/pages/merchant/register/register'
    })
  }
})