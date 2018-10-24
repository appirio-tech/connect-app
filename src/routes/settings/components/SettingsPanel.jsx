/**
 * Panel to display settings
 *
 * Can be wide or normal
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import SettingsSidebar from './SettingsSidebar'
import './SettingsPanel.scss'

const SettingsPanel = (props) => (
  <div className={cn('settings-panel', { wide: props.isWide })}>
    <SettingsSidebar selected={props.title}/>
    <div className="inner">
      <h1 className="title">{props.title}</h1>
      <div className="content">{props.children}</div>
    </div>
  </div>
)

SettingsPanel.propTypes = {
  isWide: PropTypes.bool,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  link: PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }),
  children: PropTypes.node,
  onSaveClick: PropTypes.func
}

export default SettingsPanel
