// Webpack uses this to work with directories
var webpack = require('webpack');
const path = require('path');

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

    // Path to your entry point. From this file Webpack will begin its work
    entry: {
        arrivals: './src/javascript/arrivals.js',
        home: './src/javascript/home.js',
        baggage: './src/javascript/baggage.js',
        lost: './src/javascript/lost.js',
    },
    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, 'public_html', 'dist'),
        filename: '[name].bundle.js'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            p5: 'p5',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },

    resolve: {
        modules: ['node_modules',],
        extensions: ['.js',]
    },
    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: 'development'
};
