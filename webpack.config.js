const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const { img, dependencies } = require("./ord.config");

const imgReplace = Object.entries(img).map(([key, value]) => ({
  search: `/img/${key}`,
  replace: `/content/${value}`,
}));
const productionDependencies = Object.values(dependencies)
  .map((id) => `<script src="/content/${id}" ></script>`)
  .join("");
const productionExternals = Object.keys(dependencies).reduce((acc, item) => {
  acc[item] = item;
  return acc;
}, {});

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
        ...(isProduction
          ? [
              {
                test: /\.pug$/,
                loader: "string-replace-loader",
                options: {
                  multiple: imgReplace,
                },
              },
            ]
          : []),
      ],
    },
    externals: isProduction ? productionExternals : {},
    plugins: [
      ...(isProduction
        ? []
        : [
            new CopyPlugin({
              patterns: [{ from: "./public", to: "./" }],
            }),
          ]),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        template: "./src/views/main.html",
        filename: "index.html",
        dependencies: isProduction ? productionDependencies : "",
      }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
    devServer: {
      hot: "only",
      static: {
        directory: "./dist",
      },
    },
  };
};
