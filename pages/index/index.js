// 首页逻辑
Page({
  data: {
    banners: [],
    recommendedMerchants: [],
    hotProducts: [],
    searchText: '',
    loading: false
  },

  onLoad: function () {
    // 初始化数据
    this.loadBanners()
    this.loadRecommendedMerchants()
    this.loadHotProducts()
  },

  onShow: function () {
    // 页面显示时刷新数据
    if (getApp().globalData.location) {
      this.loadRecommendedMerchants()
    }
  },

  // 搜索输入
  onSearchInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  // 搜索
  onSearch: function () {
    if (this.data.searchText.trim()) {
      wx.navigateTo({
        url: '/pages/productList/productList?keyword=' + encodeURIComponent(this.data.searchText)
      })
    }
  },

  // 加载轮播图
  loadBanners: function () {
    const db = wx.cloud.database()
    db.collection('banners').where({
      status: 1
    })
    .orderBy('sort', 'asc')
    .get()
    .then(res => {
      this.setData({
        banners: res.data
      })
    })
    .catch(err => {
      console.error('加载轮播图失败', err)
    })
  },

  // 加载推荐商家
  loadRecommendedMerchants: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    let query = db.collection('merchants').where({
      status: 1,
      isRecommended: true
    })
    
    // 如果有位置信息，按照距离排序
    if (getApp().globalData.location) {
      // 这里简化处理，实际应该在云函数中计算距离并排序
      query = query.orderBy('sort', 'asc')
    }
    
    query.limit(10)
    .get()
    .then(res => {
      // 模拟距离数据
      const merchants = res.data.map(item => {
        return {
          ...item,
          distance: Math.floor(Math.random() * 5000) + 500 // 模拟500-5500米的距离
        }
      })
      
      this.setData({
        recommendedMerchants: merchants
      })
    })
    .catch(err => {
      console.error('加载推荐商家失败', err)
    })
  },

  // 加载热门商品
  loadHotProducts: function () {
    const db = wx.cloud.database()
    
    db.collection('products').where({
      status: 1,
      isHot: true
    })
    .limit(6)
    .get()
    .then(res => {
      this.setData({
        hotProducts: res.data
      })
    })
    .catch(err => {
      console.error('加载热门商品失败', err)
    })
  },

  // 轮播图点击
  onBannerTap: function (e) {
    const bannerId = e.currentTarget.dataset.id
    // 根据banner类型进行不同的跳转
    wx.navigateTo({
      url: '/pages/activity/activity?id=' + bannerId
    })
  },

  // 跳转到商家列表
  goToMerchantList: function () {
    wx.navigateTo({
      url: '/pages/merchantList/merchantList'
    })
  },

  // 跳转到附近商家
  goToNearby: function () {
    if (!getApp().globalData.location) {
      wx.showToast({
        title: '请授权位置信息',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/merchantList/merchantList?type=nearby'
    })
  },

  // 跳转到会员中心
  goToMemberCenter: function () {
    wx.navigateTo({
      url: '/pages/memberCenter/memberCenter'
    })
  },

  // 跳转到购物车
  goToCart: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  // 跳转到商家详情
  goToMerchantDetail: function (e) {
    const merchantId = e.currentTarget.dataset.id
    getApp().setCurrentMerchant({
      _id: merchantId
    })
    wx.navigateTo({
      url: '/pages/merchantDetail/merchantDetail?id=' + merchantId
    })
  },

  // 跳转到商品详情
  goToProductDetail: function (e) {
    const productId = e.currentTarget.dataset.id
    const merchantId = e.currentTarget.dataset.merchantId
    
    getApp().setCurrentMerchant({
      _id: merchantId
    })
    
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + productId + '&merchantId=' + merchantId
    })
  },

  // 跳转到全部分类
  goToAllProducts: function () {
    wx.navigateTo({
      url: '/pages/category/category'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadBanners()
    this.loadRecommendedMerchants()
    this.loadHotProducts()
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function () {
    // 可以在这里实现分页加载
  }
})