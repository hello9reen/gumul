const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
//		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Gumul'
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif|woff2|woff|ttf|eot)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
}