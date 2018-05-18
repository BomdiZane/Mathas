const path = require('path');

module.exports = {
    entry: './public/components/index.js',
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: 'bundle.js',
        // publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                ]
            }
        ]
    }
};