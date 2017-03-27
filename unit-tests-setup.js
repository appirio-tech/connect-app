require('babel-register')()
var jsdom = require('mocha-jsdom')

// var exposedProperties = ['window', 'navigator', 'document']

jsdom()
// global.document = 
// console.log(global.window)
// global.window = document.defaultView
// Object.keys(document.defaultView).forEach((property) => {
//   if (typeof global[property] === 'undefined') {
//     exposedProperties.push(property)
//     global[property] = document.defaultView[property]
//   }
// })

// global.navigator = {
//   userAgent: 'node.js'
// }

// documentRef = document;