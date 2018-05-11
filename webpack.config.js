/**
 * @author stack fizz <huangchaolin@xylink.com>
 */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSCSS = new ExtractTextPlugin("[name].scss");

// 获取node环境变量
let env = process.env.NODE_ENV || "production";

// todo: 使用react外部cdn
const config = {
  devtool: "source-map",

  devServer: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },

  entry: {
    index: [path.resolve(__dirname, "./src/todomvc/index.tsx")],
    vendors: ["es6-promise", "fetch-ie8", "qs"]
    // , webpack: "webpack/hot/dev-server"
  },

  output: {
    path: path.resolve(__dirname, "build", env),
    filename: "js/[name].[chunkhash:8].js"
    //publicPath: conf.staticResource
  },

  resolve: {
    enforceExtension: false,
    extensions: ["", ".tsx", ".ts", ".jsx", ".js", ".css", ".scss"]
  },

  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loaders: ["ts-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "url-loader?limit=8096&name=img/[name].[hash:8].[ext]&publicPath=./"
      },

      {
        test: /\.(css|scss)$/,
        // https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/110
        loader: extractSCSS.extract(
          "style",
          "typings-for-css-modules-loader?namedExport=true&modules&localIdentName=[local]-[hash:base64:5]&importLoaders=2!postcss!sass"
        )
      }
      // ,{
      //   test: /\.(css|scss)/,
      //   loaders: [
      //     "style",
      //     "typings-for-css-modules-loader?namedExport=true&modules&localIdentName=[local]-[hash:base64:5]&importLoaders=2",
      //     "postcss",
      //     "sass"
      //   ]
      // }
    ],

    preLoaders: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loaders: ["tslint-loader"]
      }
    ],

    postLoaders: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: "src",
        loaders: ["es3ify-loader"]
      }
    ]
  },

  // tslint-loader 的配置项
  // https://github.com/wbuchwalter/tslint-loader#loader-options
  tslint: {
    fix: true // 自动根据 prettier 的配置去fix代码风格
  },

  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendors", "manifest"],
      minChunks: Infinity,
      filename: "js/[name].[hash:8].js"
    }),

    // new ExtractTextPlugin("main.[hash:8].css"),

    extractSCSS,

    new HtmlWebpackPlugin({
      template: "./public/index.html",
      chunks: ["index", "vendors", "manifest"],
      filename: "index.html"
    })
  ]
};

// 开发环境和本地环境
if (env === "development") {
  config.devtool = "source-map";

  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  );
}

// 生产环境和预发布环境
if (env === "production") {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: false
      },
      mangle: {
        screw_ie8: false
      },
      output: {
        screw_ie8: false //
      }
    })
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  );
}

module.exports = config;
