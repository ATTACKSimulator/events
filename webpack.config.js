//webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: {
		"bundle": "./index.ts",
		"bundle.min": "./index.ts",
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "[name].js", // <--- Will be compiled to this single file
		libraryTarget: "var",
		library: "ATSEvents",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{ 
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			include: /min/,
		})],
	},
};
