'use strict'

const fs = require('fs')
const path = require('path')
const renderer = require('vue-server-renderer')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaPart = require('koa-partial-content')
const template = fs.readFileSync('./src/template/index.html', 'utf-8')
const serverBundle = require('./dist/index/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/index/vue-ssr-client-manifest.json')

let app = new Koa()
let router = new KoaRouter()
let part = new koaPart('./src')
let rendererHtml = renderer.createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest 
})

router.get('/components/TbVideo/static/*.mp4', part.middleware())

app.use(router.routes())

app.use(async (ctx, next) => {
  let filename = ctx.url.split('/').pop().split('?')[0]
  if(/\.js/.test(ctx.url)) {
    ctx.set('content-type', 'application/x-javascript')
    ctx.body = fs.createReadStream(path.join(process.cwd(), './dist/index/', filename))
  } else if(/\.jpg/.test(ctx.url)) {
    ctx.set('content-type', 'image/jpeg')
    ctx.body = fs.createReadStream(path.join(process.cwd(), './src/components/TbVideo/static/', filename))
  } else {
    const context = { url: ctx.url }
    let html = await rendererHtml.renderToString(context)
    ctx.body = html
  }
});

app.listen('8011')