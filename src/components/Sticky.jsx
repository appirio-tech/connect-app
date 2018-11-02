import React from 'react'
import StickyComponent from 'react-stickynode'

export default class Sticky extends React.Component {

  constructor(props) {
    super(props)
    this.mountSticky = (sticky) => { this.sticky = sticky }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    setTimeout(() => {
      if (this.sticky) {
        this.sticky.update()
      }
    })
  }

  render() {
    return <StickyComponent ref={this.mountSticky} {...this.props} />
  }
}