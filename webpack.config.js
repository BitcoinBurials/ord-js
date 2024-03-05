const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { img, dependencies, script, styles } = require("./ord.config");

const DEV_BASE_RECURSION_URL = "https://ordinals.com";
const imgReplace = Object.entries(img).map(([key, value]) => ({
  search: `/img/${key}`,
  replace: `/content/${value}`,
}));
const cssReplace = Object.entries(styles).map(([key, value]) => ({
  search: `/${key}`,
  replace: `/content/${value}`,
}));
const scriptReplace = Object.entries(script).map(([key, value]) => ({
  search: `/${key}`,
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
                test: /\.html$/,
                loader: "raw-loader",
              },
              {
                test: /\.html|.js$/,
                loader: "string-replace-loader",
                options: {
                  multiple: [
                    ...imgReplace,
                    ...cssReplace,
                    ...scriptReplace,
                    { search: DEV_BASE_RECURSION_URL, replace: "" },
                  ],
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
              patterns: [
                {
                  from: path.join(__dirname, "public/img"),
                  to: path.join(__dirname, "dist/img"),
                },
              ],
            }),
          ]),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        template: "./src/views/main.html",
        filename: "index.html",
        dependencies: isProduction ? productionDependencies : "",
      }),
      new MiniCssExtractPlugin({ filename: "styles.css" }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
      minimize: true,
    },
    devServer: {
      hot: true,
      static: {
        directory: path.join(__dirname, "dist"),
      },
      watchFiles: ["public/**/*", "src/**/*"],
      port: 3000,
    },
  };
};
