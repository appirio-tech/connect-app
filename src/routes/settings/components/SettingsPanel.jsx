/**
 * Panel to display settings
 *
 * Can be wide or normal
 */
import React, { PropTypes } from 'react'
import cn from 'classnames'
import './SettingsPanel.scss'

const SettingsPanel = (props) => (
  <div className={cn('settings-panel', { wide: props.isWide })}>
    <div className="inner">
      <h1 className="title">{props.title}</h1>
      <p className="text">
        {props.text}
        {props.link && <a href={props.link.to}>{props.link.text}</a>}
      </p>
      <div className="content">{props.children}</div>
    </div>
  </div>
)

SettingsPanel.propTypes = {
  isWide: PropTypes.bool,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }),
  children: PropTypes.node,
  onSaveClick: PropTypes.func
}

export default SettingsPanel
