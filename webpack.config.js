const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: isProd ? "production" : "development",
  entry: {
    index: "./src/index",
    serviceWorker: "./src/workers/serviceWorker",
  },
  output: {
    publicPath: "auto",
    // assetModuleFilename: 'images/[hash][ext][query]'
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      inject: "body",
      chunks: ["index"],
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};

if (isProd) {
  config.optimization = {
    minimizer: [new TerserWebpackPlugin()],
  };
} else {
  config.devtool = "eval-cheap-module-source-map";
  config.devServer = {
    port: 30001,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    historyApiFallback: true,
    hot: false,
    liveReload: false,
    open: true,
  };
}

module.exports = config;
