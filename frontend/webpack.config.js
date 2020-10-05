var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
const autoprefixerConfig = { browsers: ['last 3 versions'] , cascade: false };
var info = autoprefixer(autoprefixerConfig).info();
console.log(info);

module.exports = {
  entry: {

    // 基础框架
    'base' : [path.resolve(__dirname, './src/js/entries/Base.entry.js')],

    // 导航
    'nav' : [path.resolve(__dirname, './src/js/entries/Nav.entry.js')],

    // Wiki页面插件
    'pageaddon' : [path.resolve(__dirname, './src/js/entries/PageAddon.entry.js')],

    // 新增Wiki页面
    'addpage' : [path.resolve(__dirname, './src/js/entries/AddPage.entry.js')],

    // 建卡器（编辑模式）
    'editcard' : [path.resolve(__dirname, './src/js/entries/EditCard.entry.js')],

    // 编辑Wiki页面
    'editwiki' : [path.resolve(__dirname, './src/js/entries/EditWiki.entry.js')],

    // 编辑建卡器页面
    'editbuild' : [path.resolve(__dirname, './src/js/entries/EditBuild.entry.js')],

    // 地图
    'map' : [path.resolve(__dirname, './src/js/entries/Map.entry.js')],

    // 规则书
    'rules' : [path.resolve(__dirname, './src/js/entries/Rules.entry.js')],

    // 骰骰子
    'dice' : [path.resolve(__dirname, './src/js/entries/Dice.entry.js')],

    // 建卡器
    'build' : [path.resolve(__dirname, './src/js/entries/Build.entry.js')],

    // 印卡
    'printer' : [path.resolve(__dirname, './src/js/entries/Printer.entry.js')],

    // 设置人物头像
    'setimg' : [path.resolve(__dirname, './src/js/entries/SetImg.entry.js')],

    // 角色一览
    'characters' : [path.resolve(__dirname, './src/js/entries/Characters.entry.js')],

    // 角色
    'character' : [path.resolve(__dirname, './src/js/entries/Character.entry.js')],

    // 数据可视化
    'datagram' : [path.resolve(__dirname, './src/js/entries/DataGram.entry.js')],

    // 图片上传
    'uploadimg' : [path.resolve(__dirname, './src/js/entries/UploadImg.entry.js')],

    // 更新记录
    'history' : [path.resolve(__dirname, './src/js/entries/History.entry.js')]

  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "static/js/[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.join(__dirname, '/node_modules/')
      },
      {
        test: /\.less$/,
        loader : 'style!css!postcss!less'
      }
    ]
  },
  postcss: [ autoprefixer(autoprefixerConfig) ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : '"production"',
      DEVELOPMENT : false,
      DEBUG : false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  externals: {
    'jquery'       : 'jQuery',
    'react'        : 'React',
    'react-dom'    : 'ReactDOM',
    'redux'        : 'Redux',
    'react-redux'  : 'ReactRedux',
    'react-router' : 'ReactRouter',
    'antd'         : 'antd',
    'recharts'     : 'Recharts'
  }
};
