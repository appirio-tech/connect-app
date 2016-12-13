require('./DropdownExamples.scss')

import Dropdown from './Dropdown'
import React from 'react'

const items = [
  'Review',
  'Web Arena',
  'Applet Arena'
]

const DropdownExamples = {
  render() {
    return (
      <section>
        <div className="dropdown-example full-width">
          <Dropdown pointerShadow>
            <a className="dropdown-menu-header">Full Width Dropdown</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>

        <div className="dropdown-example no-pointer">
          <Dropdown noPointer pointerShadow>
            <a className="dropdown-menu-header">Dropdown No Pointer</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>

        <div className="dropdown-example limited-width">
          <Dropdown pointerShadow>
            <a className="dropdown-menu-header">Limited Width Dropdown</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>

        <div className="dropdown-example limited-width">
          <Dropdown >
            <a className="dropdown-menu-header">Limited Width Dropdown No Pointer Shadow</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>

        <div className="dropdown-example limited-width">
          <Dropdown noPointer>
            <a className="dropdown-menu-header">Limited Width Dropdown No Pointer</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>

        <div className="dropdown-example limited-width pointer-left-example">
          <Dropdown pointerLeft>
            <a className="dropdown-menu-header">Limited Width Dropdown Left Pointer</a>
            <ul className="dropdown-menu-list">
              {
                items.map((link, i) => {
                  return <li key={i}><a href="javascript:;">{link}</a></li>
                })
              }
            </ul>
          </Dropdown>
        </div>
        
      </section>
    )
  }
}

module.exports = React.createClass(DropdownExamples)
