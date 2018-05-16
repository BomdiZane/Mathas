const path = require('path');

module.exports = {
    entry: './public/components/homePage.js',
    output: {
        path: path.resolve(__dirname, './public/lib'),
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