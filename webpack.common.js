const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry:   {
		app: './src/index.js'
	},
	output:  {
		filename: '[name].bundle.js',
		path:     path.resolve(__dirname, 'dist')
	},
	plugins: [
//		new CleanWebpackPlugin(['dist']),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		new HtmlWebpackPlugin({
			title:    'Gumul',
			template: './src/index.html'
		})
	],
	module:  {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			},
			{
				test:    /\.js$/,
				exclude: /node_modules/,
				loader:  'babel-loader',
				options: {
					plugins: ['transform-object-rest-spread'],
					presets: [[
						'env', {
							targets: {
								browsers: ['last 3 versions']
							}
						}
					]]
				}
			},
			{
				test: /\.css$/,
				use:  [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif|woff2|woff|ttf|eot)$/,
				use:  [
					'file-loader'
				]
			}
		]
	}
}