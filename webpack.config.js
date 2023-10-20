const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const path = require( 'path' );
module.exports = ( env ) => {
	return [
		{
			entry: {
				'wpac-admin-css': './src/scss/admin.scss',
				'wpac-admin-home-js': './src/js/react/views/Home/index.js',
				'wpac-admin-selectors-js': './src/js/react/views/Selectors/index.js',
				'wpac-admin-appearance-js': './src/js/react/views/Appearance/index.js',
				'wpac-admin-labels-js': './src/js/react/views/Labels/index.js',
				'wpac-admin-callbacks-js': './src/js/react/views/Callbacks/index.js',
				'wpac-admin-advanced-js': './src/js/react/views/Advanced/index.js',
				'wpac-admin-lazy-load-js': './src/js/react/views/LazyLoad/index.js',
				'wpac-admin-support-js': './src/js/react/views/Support/index.js',
				'wpac-admin-integrations-js': './src/js/react/views/Integrations/index.js',
				'wpac-frontend-js': './src/js/frontend/index.js',
				'wpac-frontend-idle-timer': './src/js/frontend/idle-timer.js',
				'wpac-frontend-jquery-blockUI': './src/js/frontend/jquery.blockUI.js',
				'wpac-frontend-jquery-waypoints': './src/js/frontend/jquery.waypoints.js',
				'wpac-frontend-jsuri': './src/js/frontend/jsuri.js',
				'wpac-frontend-wp-ajaxify-comments': './src/js/frontend/wp-ajaxify-comments.js',
				'wpac-frontend-menu-helper': [ './src/js/frontend/menu-helper.js', './src/scss/menu-helper.scss' ],
				'wpac-lazy-load-css': './src/scss/lazy-load.scss',
			},
			mode: env.mode,
			devtool: 'production' === env.mode ? false : 'source-map',
			output: {
				filename: '[name].js',
				sourceMapFilename: '[file].map[query]',
				assetModuleFilename: 'assets/[name][ext]',
				clean: true,
			},
			resolve: {
				alias: {
					Swal: path.resolve( __dirname, 'node_modules/sweetalert2/dist/sweetalert2.js' ),
				},
			},
			module: {
				rules: [
					{
						test: /\.(js|jsx)$/,
						exclude: /(node_modules|bower_components)/,
						loader: 'babel-loader',
						options: {
							presets: [ '@babel/preset-env', '@babel/preset-react' ],
							plugins: [
								'@babel/plugin-proposal-class-properties',
								'@babel/plugin-transform-arrow-functions',
								'lodash',
							],
						},
					},
					{
						test: /\.scss$/,
						exclude: /(node_modules|bower_components)/,
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
								},
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: true,
								},
							},
						],
					},
					{
						test: /\.css$/,
						include: [
							path.resolve(
								__dirname,
								'node_modules/@wordpress/components/build-style/style.css'
							),
						],
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
								},
							},
							'sass-loader',
						],
					},
					{
						test: /\.(woff2?|ttf|otf|eot|svg)$/,
						include: [ path.resolve( __dirname, 'fonts' ) ],
						exclude: /(node_modules|bower_components)/,
						type: 'asset/resource',
					},
					{
						test: /\.(gif?|png|jpg)$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'url-loader',
						},
					},
				],
			},
			plugins: [ new RemoveEmptyScriptsPlugin(), new MiniCssExtractPlugin() ],
		},
	];
};

