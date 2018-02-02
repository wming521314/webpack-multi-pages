const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
/*
* 0.多页面打包构建实质上就是:有多个物理html页面,页面之间用链接跳转,不需要路由;
* 1.webpack使用的各种插件不是说我们看到那么多都是必须的,你完全可以根据你自己的需求添加对应的插件
* 2.webpack以一个js文件为入口,自动搜索依赖关系来打包构建,所以所需要的css是在js里引用,而不是在html页面中引用,如:index.js文件导入index.css;
* 3.webpack2.0之后的版本,module中loaders改为rules;
* 4.HtmlWebpackPlugin:定义chunk模板,将构建好的js文件添自动引入到对应的页面,压缩html;
* 5.webpack.optimize.CommonsChunkPlugin:提取公共模块为单独文件;
* 6.CleanWebpackPlugin:清除之前的构建文件;
* 7.ExtractTextPlugin:抽取css文本,并打包到独立文件中,然后添插入到html页面;
* 8.webpack.optimize.CommonsChunkPlugin:压缩js;
*
* 后记:(1)也许是webpack版本太高的原因,style-loader并没有生效:没有把css嵌入到页面中的style标签;
*     (2)指定安装插件版本的几个符号:@x---->指定x版本,@^n.x---->n.x=<安装版本<n+1,@~x---->安装不包含x的之后的版本
* */
module.exports = {
    entry:{
        vendor: ['jquery', './src/js/common.js'],
        index: './src/js/index.js',
        cart: './src/js/cart.js'
    },
    output:{
        path: path.join(__dirname,'./dist'),
        filename: 'js/[name].js',
        publicPath: '',
        chunkFilename: "./js/[id].js"
    },
    module:{
        rules: [ //加载器
            {//解析es6语法
                test: /\.js/,
                include: path.join(__dirname,'src'),
                exclude: path.join(__dirname,'node_mudules/'),
                loader: 'babel-loader'
            },
            {//解析css
                test: /\.css$/,
                include: path.join(__dirname,'src'),
                exclude: path.join(__dirname,'node_mudules/'),
                use: ['style-loader', 'css-loader'], //css is in js ,
                /*use: ExtractTextPlugin.extract({// extract css to a css file , it works with ExtractTextPlugin in plugins
                    fallback: "style-loader",
                    use: "css-loader"
                })*/
            }

        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['vendor','index'],
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                collapseBooleanAttributes: true,
                caseSensitive: false, //是否大小写敏感
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'cart.html',
            template: './src/cart.html',
            chunks: ['vendor','cart'],
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                collapseBooleanAttributes: true,
                caseSensitive: false, //是否大小写敏感
            }
        }),
        new CleanWebpackPlugin(['dist'], {
            root:     path.join(__dirname,''),
            verbose:  true,
            dry:      false
        }),
        //new ExtractTextPlugin("style.css"), //export css to a css file , and insert into html page
        /*new ExtractTextPlugin({
            filename:  (getPath) => {
                return getPath('css/[name].css').replace('css/js', 'css');
            },
            allChunks: true
        }),*/
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['vendor','index','cart'],
            mikChunks: 3 //指定三个模块公用的模块才抽出来,假如有两个模块公用则不抽出来
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: true,
            comments: false,
            exclude: './node_modules'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    //devtool:"#source-map"
}