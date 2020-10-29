import { ExpressAdapter } from '@uvue/server'

let plugins = [
  '@uvue/server/plugins/gzip',
  '@uvue/server/plugins/serverError',
  '@uvue/server/plugins/static',
  '@uvue/server/plugins/modernBuild',
  [
    '@uvue/server/plugins/cookie',
    {
      secret: process.env.SECRET,
      options: {}
    }
  ],
  './src/server/plugin.js'
]

export default {
  adapter: ExpressAdapter,
  plugins,
  watch: [
    'server.config.js',
    'src/server/**/*.js',
    '.env',
    '.env.development.local',
    'tailwind.config.js'
  ]
}
