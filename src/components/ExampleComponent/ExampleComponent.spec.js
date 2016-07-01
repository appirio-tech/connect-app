import chai from 'chai'
import cheerio from 'cheerio'
import { createElement } from 'react'
import { renderToStaticMarkup as render } from 'react/lib/ReactDOMServer'

import ExampleComponent from './ExampleComponent.jsx'

// chai.should() only needs to be called once for all test files
// Do not include in other tests
chai.should()

describe('Example Test', () => {
  // For simple tests where there are no DOM mutations, declare your
  // test variables at the top to be reused for each test
  const props = {
    items: [
      {
        name: 'peaches',
        onSale: false,
        isFeatured: true
      },
      {
        name: 'bananas',
        onSale: true,
        isFeatured: false
      },
      {
        name: 'strawberries',
        onSale: false,
        isFeatured: false
      }
    ]
  }

  const html = render(createElement(ExampleComponent, props))
  const $ = cheerio.load(html)
  const items = $('li')

  it('renders items with content from props', () => {
    items.length.should.equal(3)

    const itemNames = items.map((i, el) => {
      return $(el).text()
    }).get().join(' ')

    itemNames.should.equal('peaches bananas strawberries')
  })

  it('adds the on-sale class for items that are on sale', () => {
    const onSaleItem = $('.on-sale')

    onSaleItem.length.should.equal(1)
    onSaleItem.text().should.equal('bananas')
  })

  it('adds the dynamic item-color class for items that are featured', () => {
    const isFeaturedItem = $('.peaches-color')

    isFeaturedItem.length.should.equal(1)
    isFeaturedItem.text().should.equal('peaches')
  })
})
