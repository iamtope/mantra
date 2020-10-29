export default {
  css: {
    normal: 'extract',
    vue: 'extract'
  },
  plugins: [
    [
      '@uvue/core/plugins/vuex',
      {
        // onHttpRequest: true,
        fetch: true
      }
    ],
    '@uvue/core/plugins/middlewares',
    '@/plugins/socket.js',
    '@uvue/core/plugins/errorHandler',
    '@/plugins/components',
    '@/plugins/httpClient',
    '@uvue/core/plugins/asyncData',
    '@/plugins/analytics'
  ]
}
