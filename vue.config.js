const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: ".",
    chainWebpack(config) {
        config.plugin("html").tap(args => {
            args[0].title = "自动文本去重"
            return args
        })
    }
})
