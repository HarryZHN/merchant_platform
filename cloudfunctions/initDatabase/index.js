// 初始化数据库集合和索引
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 集合列表
const collections = [
  'merchants',      // 商家集合
  'products',       // 商品集合
  'orders',         // 订单集合
  'users',          // 用户集合
  'members',        // 会员集合
  'addresses',      // 地址集合
  'cart',           // 购物车集合
  'coupons',        // 优惠券集合
  'userCoupons',    // 用户优惠券集合
  'evaluations',    // 评价集合
  'banners',        // 轮播图集合
  'categories',     // 分类集合
  'activities',     // 活动集合
  'adminUsers',     // 管理员用户集合
  'merchantApplications', // 商家入驻申请集合
  'deliverySettings', // 配送设置集合
  'paymentRecords'  // 支付记录集合
]

// 初始化集合和索引
async function initCollections() {
  try {
    // 初始化集合
    for (const collName of collections) {
      await db.createCollection(collName).catch(err => {
        console.log(`集合 ${collName} 已存在或创建失败:`, err.errMsg)
      })
    }

    // 创建索引
    // 商家集合索引
    await db.collection('merchants').createIndex({ status: 1, isRecommended: 1 })
    await db.collection('merchants').createIndex({ _id: 1 })
    
    // 商品集合索引
    await db.collection('products').createIndex({ merchantId: 1, status: 1 })
    await db.collection('products').createIndex({ isHot: 1, status: 1 })
    
    // 订单集合索引
    await db.collection('orders').createIndex({ userId: 1, createTime: -1 })
    await db.collection('orders').createIndex({ merchantId: 1, createTime: -1 })
    
    // 用户集合索引
    await db.collection('users').createIndex({ openid: 1 })
    
    // 会员集合索引
    await db.collection('members').createIndex({ userId: 1 })

    // 创建默认管理员
    const adminCount = await db.collection('adminUsers').count()
    if (adminCount.total === 0) {
      await db.collection('adminUsers').add({
        data: {
          username: 'admin',
          password: 'admin123', // 实际应用中需要加密存储
          role: 'super',
          createTime: db.serverDate()
        }
      })
      console.log('默认管理员创建成功')
    }

    // 创建默认轮播图数据
    const bannerCount = await db.collection('banners').count()
    if (bannerCount.total === 0) {
      await db.collection('banners').add({
        data: {
          image: 'https://example.com/banner1.png',
          link: '',
          title: '欢迎使用多租户水果店',
          status: 1,
          sort: 1,
          createTime: db.serverDate()
        }
      })
      console.log('默认轮播图创建成功')
    }

    return { success: true, message: '数据库初始化成功' }
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return { success: false, message: '数据库初始化失败', error: error.message }
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // 检查是否为管理员调用（简化处理，实际应该有更严格的权限验证）
  const result = await initCollections()
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    result
  }
}