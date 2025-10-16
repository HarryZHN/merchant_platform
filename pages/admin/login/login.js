// 管理员登录页面逻辑
Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onLoad: function () {
    // 检查是否已经登录
    const isLoggedIn = wx.getStorageSync('adminLoginStatus')
    if (isLoggedIn) {
      wx.switchTab({
        url: '/pages/admin/dashboard/dashboard'
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

  // 登录
  login: function () {
    const { username, password } = this.data
    
    // 简单的表单验证
    if (!username.trim()) {
      wx.showToast({
        title: '请输入管理员账号',
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
    
    // 调用云函数进行管理员登录验证
    wx.cloud.callFunction({
      name: 'adminAuth',
      data: {
        action: 'login',
        username: username,
        password: password
      }
    }).then(res => {
      this.setData({ loading: false })
      
      if (res.result.success) {
        // 登录成功
        const adminInfo = res.result.adminInfo
        
        // 保存登录状态
        wx.setStorageSync('adminLoginStatus', true)
        wx.setStorageSync('adminInfo', adminInfo)
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        // 跳转到管理员后台首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/admin/dashboard/dashboard'
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
      
      // 模拟登录成功（仅用于演示）
      if (username === 'admin' && password === 'admin123') {
        const adminInfo = {
          username: 'admin',
          role: 'super',
          name: '超级管理员'
        }
        
        wx.setStorageSync('adminLoginStatus', true)
        wx.setStorageSync('adminInfo', adminInfo)
        
        wx.showToast({
          title: '演示模式：登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/admin/merchantManage/merchantManage'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  // 演示账号提示
  showDemoAccount: function () {
    wx.showModal({
      title: '演示账号',
      content: '用户名：admin\n密码：admin123',
      showCancel: false
    })
  }
})