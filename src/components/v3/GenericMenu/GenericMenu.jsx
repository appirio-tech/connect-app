import React from 'react'
import PT from 'prop-types'
import './GenericMenu.scss'

class GenericMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeMenu: ''
    }
  }

  componentDidMount() {
    !!this.props.navLinks && this.props.navLinks.map((item) => {
      item.isActive && this.setState({ activeMenu: item.id })
    })
  }

  render() {
    const menu = this.props.navLinks

    return (
      <nav styleName="generic-menu">
        <ul styleName="list">
          {!!menu && menu.map((item, i) => {
            return (
              <li key={i}>
                {item.hasNewItems && <i styleName="dot" />}
                <a styleName={this.state.activeMenu === item.id ? 'active' : ''}
                  onClick={() => { this.setState({ activeMenu: item.id }) }}
                >{item.label}</a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}

GenericMenu.propTypes = {
  navLinks: PT.array
}

export default GenericMenu
