const path = require('path');

module.exports = {
    mode: 'development',
    entry: './public/components/index.js',
    output: {
        path: path.normalize(`${__dirname}/public/js`),
        filename: 'bundle.js',
        // publicPath: '/dist'
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
            }
        ]
    }
};
