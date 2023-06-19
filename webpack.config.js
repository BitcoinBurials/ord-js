const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const { img, dependencies } = require("./ord.config");
const dependencyReplace = Object.entries(dependencies).map(([key, value]) => ({
  search: `node_modules/${key}`,
  replace: `/content/${value}`,
}));
const imgReplace = Object.entries(img).map(([key, value]) => ({
  search: `/img/${key}`,
  replace: `/content/${value}`,
}));

module.exports = (env, argv) => ({
  entry: "./src/index.js",
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      { test: /\.pug$/, loader: "pug-loader" },
      ...(argv.mode === "production"
        ? [
            {
              test: /\.pug$/,
              loader: "string-replace-loader",
              options: {
                multiple: [...dependencyReplace, ...imgReplace],
              },
            },
          ]
        : []),
    ],
  },
  plugins: [
    ...(argv.mode === "development"
      ? [
          new CopyPlugin({
            patterns: [{ from: "./public", to: "./" }],
          }),
        ]
      : []),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      cache: false,
      template: "./src/views/main.pug",
      filename: "index.html",
    }),
  ],
  devServer: {
    hot: "only",
    static: {
      directory: "./dist",
    },
  },
});
