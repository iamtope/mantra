module.exports = {
  // productionSourceMap: false,

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  devServer: {
    host: '0.0.0.0'
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    /* svgRule.use('vue-svg-loader').loader('vue-svg-loader') */
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },

  transpileDependencies: [
    /v-body-scroll-lock/,
    /yan-progress/,
    /@voerro\/vue-tagsinput/
  ]
}
