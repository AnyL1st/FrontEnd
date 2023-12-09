const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const config = {
	//开发者模式服务器默认界面
	// devServer: {
	//     static: './dist'
	// },
	//打包JS输入和输出
	entry: {
		'login': path.resolve(__dirname, 'src/login/index.js'),
		'content': path.resolve(__dirname, 'src/content/index.js'),
		'publish': path.resolve(__dirname, 'src/publish/index.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: './[name]/index.js',
		clean: true
	},
	//加强插件
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'public/login.html'),
			filename: 'login/index.html',
			chunks: [`login`],
			useCdn: process.env.NODE_ENV === 'production'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'public/content.html'),
			filename: 'content/index.html',
			chunks: [`content`],
			useCdn: process.env.NODE_ENV === 'production'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'public/publish.html'),
			filename: path.resolve(__dirname, 'dist/publish/index.html'),
			chunks: [`publish`],
			useCdn: process.env.NODE_ENV === 'production'
		}),
		new MiniCssExtractPlugin({
			filename: './[name]/index.css'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),

	],
	//加载器
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', "css-loader"]
			},
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
		]
	},
	//使用cdn优化
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				commons: {
					minSize: 0,
					minChunks: 2,
					reuseExistingChunk: true,
					name(module, chunks, cacheGroupKey) {
						const allChunksNames = chunks.map(item => item.name).join(`~`)
						return `./js/${allChunksNames}`
					}
				}
			}
		}
	},
	//alias '@' 为 src文件夹
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}

}
// if开发环境,查找源码
if (process.env.NODE_ENV === 'development') {
	config.devtool = 'inline-source-map'
}
//if生产模式使用cdn
if (process.env.NODE_ENV === 'production') {
	config.externals = {
		'bootstrap/dist/css/bootstrap.min.css': 'bootstrap',
		'axios': 'axios',
		'form-serialize': 'serialize',
		'@wangeditor/editor': 'wangEditor',


	}
}
module.exports = config