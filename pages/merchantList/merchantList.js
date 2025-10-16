// 商家列表页面逻辑
Page({
  data: {
    merchants: [],
    sortType: 'default', // default, distance, sales, score
    sortOrder: 'desc', // asc, desc
    loading: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    type: '' // 'nearby' 表示附近商家
  },

  onLoad: function (options) {
    // 获取页面类型
    if (options.type) {
      this.setData({
        type: options.type
      })
    }
    
    // 初始化加载商家数据
    this.loadMerchants()
  },

  onShow: function () {
    // 页面显示时检查位置权限
    if (this.data.type === 'nearby' && !getApp().globalData.location) {
      this.getLocation()
    }
  },

  // 获取位置信息
  getLocation: function () {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        getApp().globalData.location = res
        that.loadMerchants(true) // 重新加载数据
      },
      fail: function(err) {
        console.error('获取位置失败', err)
        wx.showToast({
          title: '获取位置失败，请授权位置信息',
          icon: 'none'
        })
      }
    })
  },

  // 加载商家数据
  loadMerchants: function (reset = false) {
    if (this.data.loading || (!this.data.hasMore && !reset)) return
    
    this.setData({
      loading: true
    })
    
    if (reset) {
      this.setData({
        page: 1,
        hasMore: true,
        merchants: []
      })
    }
    
    const db = wx.cloud.database()
    const _ = db.command
    
    let query = db.collection('merchants').where({
      status: 1
    })
    
    // 根据排序类型设置排序
    switch (this.data.sortType) {
      case 'distance':
        // 实际应该在云函数中计算距离并排序
        // 这里简化处理，模拟距离排序
        query = query.orderBy('createdAt', this.data.sortOrder)
        break
      case 'sales':
        query = query.orderBy('monthlySales', this.data.sortOrder)
        break
      case 'score':
        query = query.orderBy('score', this.data.sortOrder)
        break
      default:
        query = query.orderBy('sort', 'asc')
    }
    
    // 分页加载
    query.skip((this.data.page - 1) * this.data.pageSize)
    .limit(this.data.pageSize)
    .get()
    .then(res => {
      let newMerchants = res.data
      
      // 模拟距离和推荐商品数据
      newMerchants = newMerchants.map(merchant => {
        // 模拟距离
        const distance = Math.floor(Math.random() * 10000) + 100
        
        // 模拟推荐商品
        const recommendProducts = []
        for (let i = 0; i < 3; i++) {
          recommendProducts.push({
            name: '推荐水果' + (i + 1),
            price: Math.floor(Math.random() * 30) + 10,
            image: '/images/products/fruit' + (i + 1) + '.png'
          })
        }
        
        return {
          ...merchant,
          distance: distance,
          recommendProducts: recommendProducts
        }
      })
      
      // 如果是距离排序，手动排序
      if (this.data.sortType === 'distance') {
        newMerchants.sort((a, b) => {
          return this.data.sortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance
        })
      }
      
      this.setData({
        merchants: reset ? newMerchants : [...this.data.merchants, ...newMerchants],
        loading: false,
        hasMore: newMerchants.length === this.data.pageSize
      })
      
      if (this.data.hasMore) {
        this.setData({
          page: this.data.page + 1
        })
      }
    })
    .catch(err => {
      console.error('加载商家失败', err)
      this.setData({
        loading: false
      })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    })
  },

  // 默认排序
  sortByDefault: function () {
    if (this.data.sortType === 'default') return
    
    this.setData({
      sortType: 'default',
      sortOrder: 'desc'
    })
    
    this.loadMerchants(true)
  },

  // 按距离排序
  sortByDistance: function () {
    if (this.data.sortType === 'distance') {
      // 切换排序顺序
      this.setData({
        sortOrder: this.data.sortOrder === 'asc' ? 'desc' : 'asc'
      })
    } else {
      this.setData({
        sortType: 'distance',
        sortOrder: 'asc' // 默认距离升序（近到远）
      })
    }
    
    this.loadMerchants(true)
  },

  // 按销量排序
  sortBySales: function () {
    if (this.data.sortType === 'sales') {
      // 切换排序顺序
      this.setData({
        sortOrder: this.data.sortOrder === 'asc' ? 'desc' : 'asc'
      })
    } else {
      this.setData({
        sortType: 'sales',
        sortOrder: 'desc' // 默认销量降序
      })
    }
    
    this.loadMerchants(true)
  },

  // 按评分排序
  sortByScore: function () {
    if (this.data.sortType === 'score') {
      // 切换排序顺序
      this.setData({
        sortOrder: this.data.sortOrder === 'asc' ? 'desc' : 'asc'
      })
    } else {
      this.setData({
        sortType: 'score',
        sortOrder: 'desc' // 默认评分降序
      })
    }
    
    this.loadMerchants(true)
  },

  // 跳转到商家详情
  goToMerchantDetail: function (e) {
    const merchantId = e.currentTarget.dataset.id
    
    // 查找当前商家信息
    const merchant = this.data.merchants.find(item => item._id === merchantId)
    if (merchant) {
      getApp().setCurrentMerchant(merchant)
    }
    
    wx.navigateTo({
      url: '/pages/merchantDetail/merchantDetail?id=' + merchantId
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadMerchants(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMerchants()
    }
  }
})