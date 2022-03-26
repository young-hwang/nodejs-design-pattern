'use strict'

const urlResolve = require('url').resolve
const urlParse = require('url').parse
const path = require('path')

const slug = require('slug')
const cheerio = require('cheerio')

module.exports.urlToFilename = url => {
  const parsedUrl = urlParse(url)
  const urlPath = parsedUrl.path
    .split('/')
    .filter(function (component) {
      return component !== ''
    })
    .map(function (component) {
      return slug(component, { remove: null })
    })
    .join('/')
  let filename = path.join(parsedUrl.hostname, urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }
  return filename
}

module.exports.getLinkUrl = function (currentUrl, element) {
  const link = urlResolve(currentUrl, element.attribs.href || "")
  const parsedUrl = urlParse(link)
  const currentParseUrl = urlParse(currentUrl)
  if (parsedUrl.hostname !== currentParseUrl.hostname || !parsedUrl.pathname) {
    return null
  }
  return link;
}

module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(element => module.exports.getLinkUrl(currentUrl, element))
    .filter(element => !!element)
}

