const path = require('path')
const { readFile } = require('fs').promises
const filendir = require('filendir')
const glob = require('fast-glob')
const mjml2html = require('mjml')
var appRoot = require('app-root-path')

async function start () {
  // Todo: clear  emails before
  const templates = await glob(appRoot.path + '/src/emailsrc/**/*.mjml')
  try {
    const compiledTemplates = await Promise.all(
      templates.map(template => {
        return readFile(template, { encoding: 'utf-8' }).then(html => {
          const extension = path.extname(template)
          return {
            name: path.basename(template, extension),
            html: mjml2html(html, { beautify: true }).html
          }
        })
      })
    )

    await Promise.all(
      compiledTemplates.map(template => {
        const outputPath = path.join(
          appRoot.path,
          'src',
          'server',
          'emails',
          template.name,
          'html.hbs'
        )

        return filendir.writeFile(outputPath, template.html, function () {
          return Promise.resolve()
        })
      })
    )
    console.log('Building Emails done')
  } catch (error) {
    console.log('Building Failed!', error)
  }
}

start()
