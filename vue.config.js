module.exports = {
  chainWebpack: config => {
    config.output.filename('[name].[hash].js')
    config.output.chunkFilename('[id].[chunkhash:8].js')
    config.plugins.delete('prefetch')
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH || undefined,
  lintOnSave: false,
  devServer: {
    port: 9100,
    proxy: {
      '^/api': {
        target: 'http://localhost:8080'
      }
    }
  },

  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}
