const path = require('path'),
	miniCssExtractPlugin = require('mini-css-extract-plugin'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
	OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		home: './app/views/components/home.js',
		error: './app/views/components/error.js',
	},
	output: {
		path: path.normalize(`${__dirname}/app/static/js`),
		filename: '[name].js',
		// publicPath: '/static'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['react', 'env']
					}
				}
			},
			{
				test: /\.scss$/,
				use: [miniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
		]
	},
	plugins: [
		new miniCssExtractPlugin({
			filename: '../css/[name].css'
		})
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				uglifyOptions: {
					ecma: 6,
				}
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
};
