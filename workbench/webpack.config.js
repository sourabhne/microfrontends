const path = require('path');
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "workbench",
    projectName: "root-config",
    webpackConfigEnv,
  });


  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    mode: 'development',
    target: 'node', // in order too ignore built-in modules like path, fs, etc.
    module: {
      rules: [
            {
              test: /\.js?$/,
              exclude: [path.resolve(__dirname, 'node_modules')],
              loader: 'babel-loader',
            },
            {
              test: /\.css$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[path][name]__[local]'
                  }
                }
              ],
              exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
              test: /\.css$/,
              include: [path.resolve(__dirname, 'node_modules')],
              use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    devServer: {
      historyApiFallback: true,
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal === "true",
        },
      }),
    ],
  });
};