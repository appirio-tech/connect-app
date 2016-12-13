'use strict'


import StandardListItem from './StandardListItem'
import React from 'react'

const StandardListItemExamples = () => (
  <div className="StandardListItemExamples flex column middle center light-bg">
    <h1>Default</h1>

    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="This is a test"  />

    <h1>Icon on the Left</h1>

    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="This is a test" placeIcon="left"  />

    <h1>Icon on the Right</h1>

    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="This is a test" placeIcon="right" />

    <h1>Icon Hidden</h1>
    <StandardListItem labelText="This is a test" showIcon={false}  />

    <h1>Label Hidden</h1>
    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" showLabel={false}  />

    <h1>With Link In Self</h1>
    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="Click Me" linkUrl="http://google.com" />

    <h1>With Link In New Tab</h1>
    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="Click Me" linkUrl="http://google.com" linkTarget="_blank" />

    <h1>Link: Icon on the Right</h1>
    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="This is a test" placeIcon="right" linkUrl="http://google.com"  />

    <h1>Link: Icon on the Left</h1>
    <StandardListItem imgSrc="../components/Avatar/place-holder.svg" labelText="This is a test" placeIcon="left" linkUrl="http://google.com"  />

  </div>
)

module.exports = StandardListItemExamples
