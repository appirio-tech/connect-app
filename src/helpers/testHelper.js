/**
 * Helper script which let us run tests using browser specific objects like `document` and `window`
 * in Node.js environment without using headless browser like phanthom.
 *
 * We use for now this simple way, as we almost don't have any tests, and mocking document and window
 * for our test cases is more than enough.
 */
import { jsdom } from 'jsdom'

const doc = jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView

global.document = doc
global.window = win

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key]
  }
})