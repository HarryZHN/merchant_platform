// 购物车页面逻辑
Page({
  data: {
    cart: [],
    currentMerchant: {},
    selectAll: false,
    selectedCount: 0,
    totalPrice: 0
  },

  onShow: function () {
    this.loadCartData()
  },

  // 加载购物车数据
  loadCartData: function () {
    const app = getApp()
    let cart = app.globalData.cart || []
    
    // 为购物车商品添加选中状态
    cart = cart.map(item => ({
      ...item,
      checked: true
    }))
    
    this.setData({
      cart: cart,
      currentMerchant: app.globalData.currentMerchant || {}
    })
    
    this.updateCartStatus()
  },

  // 更新购物车选中状态和总价
  updateCartStatus: function () {
    const cart = this.data.cart
    const selectAll = cart.length > 0 && cart.every(item => item.checked)
    const selectedCount = cart.filter(item => item.checked).length
    const totalPrice = cart.reduce((sum, item) => {
      return item.checked ? sum + item.price * item.quantity : sum
    }, 0)
    
    this.setData({
      selectAll: selectAll,
      selectedCount: selectedCount,
      totalPrice: totalPrice
    })
    
    // 保存到全局
    getApp().globalData.cart = cart
    getApp().saveCartToStorage()
  },

  // 选中/取消选中商品
  toggleItemCheck: function (e) {
    const productId = e.currentTarget.dataset.id
    const cart = this.data.cart.map(item => {
      if (item._id === productId) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    
    this.setData({ cart: cart })
    this.updateCartStatus()
  },

  // 全选/取消全选
  toggleSelectAll: function () {
    const selectAll = !this.data.selectAll
    const cart = this.data.cart.map(item => ({
      ...item,
      checked: selectAll
    }))
    
    this.setData({ cart: cart })
    this.updateCartStatus()
  },

  // 减少商品数量
  decreaseQuantity: function (e) {
    const productId = e.currentTarget.dataset.id
    const cart = this.data.cart.map(item => {
      if (item._id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 }
      }
      return item
    })
    
    this.setData({ cart: cart })
    this.updateCartStatus()
  },

  // 增加商品数量
  increaseQuantity: function (e) {
    const productId = e.currentTarget.dataset.id
    const cart = this.data.cart.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    
    this.setData({ cart: cart })
    this.updateCartStatus()
  },

  // 手动修改商品数量
  onQuantityChange: function (e) {
    const productId = e.currentTarget.dataset.id
    let quantity = parseInt(e.detail.value)
    
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1
    }
    
    const cart = this.data.cart.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: quantity }
      }
      return item
    })
    
    this.setData({ cart: cart })
    this.updateCartStatus()
  },

  // 删除商品
  deleteItem: function (e) {
    const productId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cart = this.data.cart.filter(item => item._id !== productId)
          this.setData({ cart: cart })
          this.updateCartStatus()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 去购物
  goShopping: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 去结算
  goToSettle: function () {
    const selectedItems = this.data.cart.filter(item => item.checked)
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要结算的商品',
        icon: 'none'
      })
      return
    }
    
    // 保存选中的商品到全局，供结算页面使用
    getApp().globalData.selectedCartItems = selectedItems
    
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm'
    })
  },

  // 跳转到商品详情
  goToProductDetail: function (e) {
    const productId = e.currentTarget.dataset.id
    const merchantId = e.currentTarget.dataset.merchantId || this.data.currentMerchant._id
    
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + productId + '&merchantId=' + merchantId
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadCartData()
    wx.stopPullDownRefresh()
  }
})