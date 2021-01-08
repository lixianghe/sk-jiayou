// 一些基础配置，比如按钮个数
const pageConfig = {
  // 首页配置
  index: {
    /**
     * 界面样式配置
     * 说明：按钮在button中配置，其他项为数据传入
     * h1 横图最多态：主图片 1个（必须）、副标签 1~2个（可选,字数限制 4）、主标题 1个（必须,字数限制 24）、副标题 1个（可选,字数限制 14）、按钮 1~2个（可选）
     * h2 横图中间态：主图片 1个（必须）、副标签 1~2个（可选）、主标题 1个（必须）、按钮 1个（可选）
     * h3 横图最少态：主图片 1个（必须）、副标签 1~2个（可选）、主标题 1个（必须）、副标题 1个（可选）
     * v1 竖图最多态：主图片 1个（必须）、主标签 1个（可选）、副标签 1个（可选,字数限制 3）、主标题 1个（必须）、副标题 1~2个（可选）、按钮 1~2个（可选）
     * v2 竖图中间态：主图片 1个（必须）、主标签 1个（可选）、副标签 1个（可选,字数限制 3）、主标题 1个（必须）、按钮 1~2个（可选）
     * v3 竖图最少态：主图片 1个（必须）、主标题 1个（必须）、副标题 1个（可选）
     * no 无图态: 副标签 1~3个（可选）、主标题 1个（必须）、副标题 1个（可选）、按钮 1~2个（可选）
     */
    type: 'v1',
    button: [{
        icon: '/images/navigation.png',
        text: '导航',
        type: 'navigation'
      },
      {
        icon: '/images/phone.png',
        text: '电话',
        type: 'menu'
      }
    ],
    /**
     * 模板静态数据
     * 各元素对应字段：主图片--image、主标签--mainLabel、副标签--subLabel、主标题--mainTitle、副标题--subTitle
     */
    pageData: [{
      "id": "1339160",
      "mainTitle": "中图能源加油站圆明园西路站",
      "subTitle": ["海淀区圆明园西路2号"],
      "mainLabel": "4.92",
      "subLabel": ["加油200省25.34"],
      "duration": 122,
      "image": "http://p1.meituan.net/400.400/moviemachine/5cbf9a626b7ed27c96ca3c748655b3ec2550103.jpg",
      "score": "9.4",
      "lat": "30.506049",
      "lng": "114.393118",
      "address": "武汉市雄楚大道关西小区"
    }, {
      "id": "1331267",
      "mainTitle": "壳牌华城欣加油站",
      "subTitle": ["海淀区西二旗西路2号"],
      "mainLabel": "4.72",
      "subLabel": ["青春"],
      "duration": 97,
      "image": "http://p1.meituan.net/400.400/movie/c16b0a68f95d884d428f339f8eacce834410200.jpg",
      "score": "9.2",
      "lat": "30.506049",
      "lng": "114.393118",
      "address": "武汉市雄楚大道关西小区"
    },{
      "id": "1339160",
      "mainTitle": "中图能源加油站",
      "subTitle": ["海淀区圆明园西路2号"],
      "mainLabel": "4.92",
      "subLabel": ["加油200省25.34"],
      "duration": 122,
      "image": "http://p1.meituan.net/400.400/moviemachine/5cbf9a626b7ed27c96ca3c748655b3ec2550103.jpg",
      "score": "9.4"
    }, {
      "id": "1331267",
      "mainTitle": "壳牌华城欣加油站",
      "subTitle": ["海淀区西二旗西路2号"],
      "mainLabel": "4.72",
      "subLabel": ["青春"],
      "duration": 97,
      "image": "http://p1.meituan.net/400.400/movie/c16b0a68f95d884d428f339f8eacce834410200.jpg",
      "score": "9.2"
    },{
      "id": "1339160",
      "mainTitle": "中图能源加油站",
      "subTitle": ["海淀区圆明园西路2号"],
      "mainLabel": "4.92",
      "subLabel": ["加油200省25.34"],
      "duration": 122,
      "image": "http://p1.meituan.net/400.400/moviemachine/5cbf9a626b7ed27c96ca3c748655b3ec2550103.jpg",
      "score": "9.4"
    }, {
      "id": "1331267",
      "mainTitle": "壳牌华城欣加油站",
      "subTitle": ["海淀区西二旗西路2号"],
      "mainLabel": "4.72",
      "subLabel": ["青春"],
      "duration": 97,
      "image": "http://p1.meituan.net/400.400/movie/c16b0a68f95d884d428f339f8eacce834410200.jpg",
      "score": "9.2"
    },{
      "id": "1339160",
      "mainTitle": "中图能源加油站",
      "subTitle": ["海淀区圆明园西路2号"],
      "mainLabel": "4.92",
      "subLabel": ["加油200省25.34"],
      "duration": 122,
      "image": "http://p1.meituan.net/400.400/moviemachine/5cbf9a626b7ed27c96ca3c748655b3ec2550103.jpg",
      "score": "9.4"
    }, {
      "id": "1331267",
      "mainTitle": "壳牌华城欣加油站",
      "subTitle": ["海淀区西二旗西路2号"],
      "mainLabel": "4.72",
      "subLabel": ["青春"],
      "duration": 97,
      "image": "http://p1.meituan.net/400.400/movie/c16b0a68f95d884d428f339f8eacce834410200.jpg",
      "score": "9.2"
    },{
      "id": "1339160",
      "mainTitle": "中图能源加油站",
      "subTitle": ["海淀区圆明园西路2号"],
      "mainLabel": "4.92",
      "subLabel": ["加油200省25.34"],
      "duration": 122,
      "image": "http://p1.meituan.net/400.400/moviemachine/5cbf9a626b7ed27c96ca3c748655b3ec2550103.jpg",
      "score": "9.4"
    }, {
      "id": "1331267",
      "mainTitle": "壳牌华城欣加油站",
      "subTitle": ["海淀区西二旗西路2号"],
      "mainLabel": "4.72",
      "subLabel": ["青春"],
      "duration": 97,
      "image": "http://p1.meituan.net/400.400/movie/c16b0a68f95d884d428f339f8eacce834410200.jpg",
      "score": "9.2"
    }]
  }
}

export default pageConfig