'use strict'

Loader = require './Loader'
React  = require 'react'

LoaderExamples = ->
  <div className="LoaderExamples flex column middle center">
    <h1>Default</h1>

    <Loader />
  </div>

module.exports = LoaderExamples
