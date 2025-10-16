// 模拟数据，用于演示
const mockData = {
  // 商家数据
  merchants: [
    {
      _id: 'merchant1',
      name: '鲜果园',
      logo: '/images/default/shop.png',
    coverImage: '/images/default/shop.png',
      address: '北京市朝阳区建国路88号',
      contactPhone: '13800138001',
      description: '新鲜水果，品质保证',
      score: 4.8,
      monthlySales: 1234,
      deliveryFee: 5,
      minOrderAmount: 20,
      status: 1,
      isRecommended: true,
      tags: ['品质保证', '新鲜直达', '满30减5'],
      latitude: 39.9042,
      longitude: 116.4074,
      createdAt: new Date()
    },
    {
      _id: 'merchant2',
      name: '水果王国',
      logo: '/images/default/shop.png',
    coverImage: '/images/default/shop.png',
      address: '北京市海淀区中关村大街1号',
      contactPhone: '13900139002',
      description: '进口水果专卖店',
      score: 4.6,
      monthlySales: 892,
      deliveryFee: 6,
      minOrderAmount: 25,
      status: 1,
      isRecommended: true,
      tags: ['进口水果', '有机认证', '免费配送'],
      latitude: 39.9842,
      longitude: 116.3074,
      createdAt: new Date()
    }
  ],

  // 商品数据
  products: [
    {
      _id: 'product1',
      merchantId: 'merchant1',
      name: '泰国进口山竹',
      images: ['/images/default/product.png'],


      price: 29.9,
      originalPrice: 39.9,
      stock: 100,
      sales: 234,
      category: '进口水果',
      description: '新鲜泰国山竹，果肉洁白细嫩，甜中带酸',
      spec: '500g/份',
      origin: '泰国',
      shelfLife: '5-7天',
      status: 1,
      isHot: true,
      isNew: false,
      createdAt: new Date()
    },
    {
      _id: 'product2',
      merchantId: 'merchant1',
      name: '海南三亚芒果',
      images: ['/images/default/product.png'],


      price: 19.9,
      originalPrice: 25.9,
      stock: 200,
      sales: 567,
      category: '国产水果',
      description: '海南三亚特产芒果，香甜多汁',
      spec: '1kg/份',
      origin: '海南',
      shelfLife: '3-5天',
      status: 1,
      isHot: true,
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'product3',
      merchantId: 'merchant2',
      name: '美国进口车厘子',
      images: ['/images/default/product.png'],


      price: 59.9,
      originalPrice: 79.9,
      stock: 50,
      sales: 123,
      category: '进口水果',
      description: '美国进口大樱桃，个大肉厚，鲜甜可口',
      spec: '500g/份',
      origin: '美国',
      shelfLife: '3-5天',
      status: 1,
      isHot: true,
      isNew: false,
      createdAt: new Date()
    }
  ],

  // 轮播图数据
  banners: [
    {
      _id: 'banner1',
      image: '/images/default/product.png',
      title: '新鲜水果限时优惠',
      link: '',
      status: 1,
      sort: 1,
      createdAt: new Date()
    },
    {
      _id: 'banner2',
      image: '/images/default/product.png',
      title: '新用户注册立减10元',
      link: '',
      status: 1,
      sort: 2,
      createdAt: new Date()
    }
  ],

  // 分类数据
  categories: [
    { id: 'cat1', name: '当季水果', icon: '/images/menu/fruit.png' },
    { id: 'cat2', name: '进口水果', icon: '/images/menu/import.png' },
    { id: 'cat3', name: '果切礼盒', icon: '/images/menu/gift.png' },
    { id: 'cat4', name: '热带水果', icon: '/images/menu/tropical.png' },
    { id: 'cat5', name: '国产水果', icon: '/images/menu/local.png' },
    { id: 'cat6', name: '坚果零食', icon: '/images/menu/nuts.png' }
  ],

  // 订单状态
  orderStatus: {
    0: { text: '待付款', color: '#ff9500' },
    1: { text: '待发货', color: '#ff6b81' },
    2: { text: '待收货', color: '#4cd964' },
    3: { text: '已完成', color: '#5856d6' },
    4: { text: '已取消', color: '#999' },
    5: { text: '退款中', color: '#ff3b30' }
  }
}

module.exports = mockData