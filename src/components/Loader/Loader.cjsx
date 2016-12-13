'use strict'

require './LoaderStyle.scss'

React = require 'react'

Loader = ->
  <div className="Loader">
    <div className="Loader__container">
      <div className="Loader__loader"/>
    </div>
  </div>

module.exports = Loader
