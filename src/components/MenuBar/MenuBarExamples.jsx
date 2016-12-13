import React from 'react'
import MenuBar from './MenuBar'

require('./MenuBarExamples.scss')

const primaryNavigationItems = [
  {img: '../components/MenuBar/nav-community.svg', text: 'Community', link: '/community'},
  {img: '../components/MenuBar/nav-compete.svg', text: 'Compete', link: '/compete', selected: true},
  {img: '../components/MenuBar/nav-learn.svg', text: 'Learn', link: '/MenuBarExamples', regex: '/MenuBar*'}
]

const MenuBarExample = () => (

  <div>
    <MenuBar items={primaryNavigationItems} orientation="horizontal" />
    <MenuBar items={primaryNavigationItems} orientation="vertical" />
    <MenuBar items={primaryNavigationItems} orientation="horizontal" mobileBreakPoint={767} />
  </div>
)

module.exports = MenuBarExample
