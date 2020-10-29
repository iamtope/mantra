class TailwindExtractor {
  static extract (content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []
  }
}
let plugins = {
  tailwindcss: './tailwind.config.js',
  'postcss-hexrgba': {},
  'postcss-nested': {},
  cssnano: { preset: 'default' }
}

if (process.env.NODE_ENV === 'production') {
  plugins['@fullhuman/postcss-purgecss'] = {
    content: ['./src/**/*.vue'],
    extractors: [
      {
        extractor: TailwindExtractor,

        extensions: ['vue', 'js', 'html']
      }
    ],
    whitelist: ['html']
  }
}

module.exports = {
  syntax: 'postcss-scss',
  plugins
}
