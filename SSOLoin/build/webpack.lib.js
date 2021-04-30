const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        app: ['./packages/main.ts']
    },
    // output: {
    //     path: path.resolve(process.cwd(), './lib'),
    //     publicPath: '/dist/',
    //     filename: 'SSOLogin.min.js',
    //     chunkFilename: '[id].js',
    //     libraryExport: 'default',
    //     library: 'SSOLogin',
    //     libraryTarget: 'commonjs2'
    // },
    output: {
        path: path.resolve(process.cwd(), './lib'),
        publicPath: '/dist/',
        filename: 'SSOLogin.min.js',
        chunkFilename: '[id].js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: 'SSOLogin',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, '../tsconfig.json'),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new ProgressBarPlugin(),
        new CleanWebpackPlugin()
    ]
}
