const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const entry = process.env.NODE_ENV === "prod" ? {
    "xray": "./index.ts",
    "xray.min": "./index.ts"
} : {
    "xray": "./index.ts"
};

module.exports = {
    target: "web",
    context: __dirname,
    entry: entry,
    externals: [nodeExternals()],
    devtool: "source-map",
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension.
        extensions: [".ts", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            generateStatsFile: true,
            openAnalyzer: false,
            reportFilename: path.resolve(__dirname, "../../reports/render-client-stats.html"),
            statsFilename: path.resolve(__dirname, "../../reports/render-client-stats.json")
        })
    ],
    module: {
        rules: [{
                test: /\.(obj|txt)$/,
                loader: "raw-loader",
                exclude: [/(node_modules)/, /(test)/, /(out)/]
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: [/(node_modules)/, /(test)/, /(out)/]
            },
            {
                enforce: "pre",
                test: /\.(js)$/,
                loader: "eslint-loader",
                exclude: [/(node_modules)/, /(test)/, /(out)/]
            },
            {
                enforce: "pre",
                test: /\.(ts)$/,
                loader: "tslint-loader",
                exclude: [/(node_modules)/, /(test)/, /(out)/]
            }
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../../dist/client"),
        library: "xray",
        libraryTarget: "umd"
    }
};