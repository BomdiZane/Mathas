const path = require('path'),
    ETP = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './public/components/index.js',
    output: {
        path: path.normalize(`${__dirname}/public/js`),
        filename: 'bundle.js',
        // publicPath: '/public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["react", "env"]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ETP.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
        ]
    },
    plugins: [
        new ETP('../css/bundle.css')
    ]
};
