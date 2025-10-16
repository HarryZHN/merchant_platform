// 用户中心页面逻辑
Page({
  data: {
    userInfo: null,
    userId: '',
    memberLevel: '普通会员',
    points: 0,
    couponCount: 0
  },

  onShow: function () {
    this.loadUserInfo()
    this.loadMemberInfo()
    this.loadCouponCount()
  },

  // 加载用户信息
  loadUserInfo: function () {
    const app = getApp()
    const userInfo = app.globalData.userInfo
    
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      
      // 从本地存储获取用户ID
      const userId = wx.getStorageSync('userId')
      if (userId) {
        this.setData({ userId: userId })
      }
    }
  },

  // 获取用户信息（登录）
  getUserInfo: function () {
    const that = this
    
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        
        that.setData({
          userInfo: res.userInfo
        })
        
        // 保存用户信息到云数据库
        const db = wx.cloud.database()
        db.collection('users').add({
          data: {
            ...res.userInfo,
            openid: wx.getStorageSync('openid') || '',
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate()
          },
          success: result => {
            console.log('用户信息保存成功', result)
            wx.setStorageSync('userId', result._id)
            that.setData({ userId: result._id })
            that.loadMemberInfo()
          },
          fail: err => {
            console.error('用户信息保存失败', err)
          }
        })
      },
      fail: err => {
        console.error('获取用户信息失败', err)
      }
    })
  },

  // 加载会员信息
  loadMemberInfo: function () {
    const db = wx.cloud.database()
    const userId = wx.getStorageSync('userId')
    
    if (userId) {
      db.collection('members').where({
        userId: userId
      }).get().then(res => {
        if (res.data.length > 0) {
          const member = res.data[0]
          this.setData({
            memberLevel: member.level || '普通会员',
            points: member.points || 0
          })
        } else {
          // 如果没有会员信息，创建默认会员记录
          db.collection('members').add({
            data: {
              userId: userId,
              level: '普通会员',
              points: 0,
              createTime: db.serverDate()
            }
          })
        }
      }).catch(err => {
        console.error('加载会员信息失败', err)
      })
    }
  },

  // 加载优惠券数量
  loadCouponCount: function () {
    const db = wx.cloud.database()
    const userId = wx.getStorageSync('userId')
    
    if (userId) {
      db.collection('userCoupons').where({
        userId: userId,
        status: 0 // 未使用
      }).count().then(res => {
        this.setData({
          couponCount: res.total
        })
      }).catch(err => {
        console.error('加载优惠券数量失败', err)
      })
    }
  },

  // 跳转到会员中心
  goToMemberCenter: function () {
    if (!this.data.userInfo) {
      this.getUserInfo()
      return
    }
    wx.navigateTo({
      url: '/pages/memberCenter/memberCenter'
    })
  },

  // 跳转到订单列表
  goToOrderList: function (e) {
    const status = e.currentTarget.dataset.status || ''
    wx.navigateTo({
      url: '/pages/orderList/orderList?status=' + status
    })
  },

  // 跳转到优惠券页面
  goToCoupons: function () {
    wx.navigateTo({
      url: '/pages/coupons/coupons'
    })
  },

  // 跳转到地址管理
  goToAddress: function () {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },

  // 跳转到我的收藏
  goToFavorites: function () {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  // 跳转到我的评价
  goToEvaluations: function () {
    wx.navigateTo({
      url: '/pages/evaluations/evaluations'
    })
  },

  // 跳转到客服中心
  goToCustomerService: function () {
    wx.navigateTo({
      url: '/pages/customerService/customerService'
    })
  },

  // 跳转到设置页面
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  // 跳转到关于我们
  goToAbout: function () {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  // 跳转到商家登录
  goToMerchantLogin: function () {
    wx.navigateTo({
      url: '/pages/merchant/login/login'
    })
  },

  // 跳转到管理员登录
  goToAdminLogin: function () {
    wx.navigateTo({
      url: '/pages/admin/login/login'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadUserInfo()
    this.loadMemberInfo()
    this.loadCouponCount()
    wx.stopPullDownRefresh()
  }
})