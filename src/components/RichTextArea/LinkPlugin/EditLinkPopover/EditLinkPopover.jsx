import React from 'react'
import { Popper, Manager } from 'react-popper'
import cn from 'classnames'
import newLinkifyIt from 'linkify-it'
import tlds from 'tlds'

import styles from './EditLink.scss'

const linkifyIt = newLinkifyIt()
linkifyIt.tlds(tlds)

/**
 * Form to update link text or url
 *
 * params
 *   text - link text value
 *   url - link url value
 *   onFormSubmit - form submit callback
 *   onUrlChange - url change callback
 *   onTextChange - text change callback
 */
class EditForm extends React.Component {
  componentDidMount() {
    const { focusUrl, focusText } = this.props

    if (focusUrl && this.urlEl) {
      this.urlEl.focus()
    } else if (focusText && this.textEl) {
      this.textEl.focus()
      this.textEl.select()
    }
  }
  testLink(url) {
    const link = linkifyIt.pretest(url) && linkifyIt.match(url)
    return link && link[0].text === url
  }
  render() {
    const {
      text = '',
      url = '',
      onFormSubmit,
      onUrlChange,
      onTextChange,
      multiLineEdit
    } = this.props
    return (
      <form className={styles.editForm}>
        {multiLineEdit ? null : (
          <div className={styles.formControlContainer}>
            <label className={styles.formControlLabel} htmlFor="editLinkTitle">
              Text
            </label>
            <input
              ref={el => (this.textEl = el)}
              id="editLinkTitle"
              type="text"
              value={text || ''}
              onChange={onTextChange}
              className={styles.formControl}
            />
          </div>
        )}
        <div className={styles.formControlContainer}>
          <label className={styles.formControlLabel} htmlFor="editLinkUrl">
            Link
          </label>
          <input
            ref={el => (this.urlEl = el)}
            id="editLinkUrl"
            type="text"
            placeholder="Paste a link"
            value={url || ''}
            onChange={onUrlChange}
            className={styles.formControl}
          />
        </div>
        <div className={styles.applyButtonWrapper}>
          <button
            type="submit"
            className="tc-btn tc-btn-primary tc-btn-sm"
            onClick={e => {
              e.preventDefault()
              onFormSubmit()
            }}
            disabled={!url || !this.testLink(url)}
          >
            Apply
          </button>
        </div>
      </form>
    )
  }
}

/**
 * Component to show Change / Remove options initially
 *
 * params
 *   url - url value
 *   text - link text value
 *   change - calback to notify Change / Add text click action
 *   remove - callback to notify Remov click action
 */
function EditOptions({ url, text, change, remove }) {
  const decodedUrl = decodeURI(url)
  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer" className={styles.link}>
        {decodedUrl}
      </a>
      &nbsp;-&nbsp;
      <span onClick={() => change()} className={styles.actionBtnLink}>
        {text ? 'Change' : 'Add text'}
      </span>
      &nbsp;|&nbsp;
      <span onClick={() => remove()} className={styles.actionBtnLink}>
        Remove
      </span>
    </div>
  )
}

/**
 * A Wrapper component to include initial edit options and
 * Edit form components in popover.
 */
export default class EditLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      url: '',
      editing: false
    }

    this.currentlyEditingEntity = null
    this.selfClick = false

    this.onSelfClick = this.onSelfClick.bind(this)
    this.onDocClick = this.onDocClick.bind(this)
  }

  componentDidMount() {
    const { editing, text, url, entityKey } = this.props

    this.currentlyEditingEntity = entityKey
    this.setState({
      text,
      url,
      editing
    })

    // ignore the first click to open
    setTimeout(() => {
      document.addEventListener('mousedown', this.onDocClick)
    })
  }

  componentWillReceiveProps(newProps) {
    const { editing, text, url, entityKey } = newProps || {}

    if (entityKey !== this.currentlyEditingEntity) {
      this.currentlyEditingEntity = entityKey
      this.setState({
        text,
        url,
        editing
      })
    } else if (text !== this.props.text) {
      this.setState({
        text
      })
    }
  }

  onSelfClick() {
    this.selfClick = true
  }

  onDocClick() {
    if (!this.selfClick) {
      this.props.onOutsideClick()
    } else {
      this.selfClick = false
    }
  }

  componentWillUnmount() {
    this.props.close && this.props.close()
    document.removeEventListener('mousedown', this.onDocClick)
  }

  setFormFieldState(field, value) {
    this.setState({
      [field]: value
    })
  }

  edit(editing) {
    this.setState({
      editing
    })
  }

  render() {
    const { editing, url, text } = this.state
    const {
      anchorEl,
      entityKey,
      onRemove,
      onUpdate,
      focusUrl,
      multiLineEdit,
      focusText,
      onEdit,
      popoverOnTop
    } = this.props

    const editFormProps = {
      text,
      url,
      focusUrl,
      focusText,
      multiLineEdit,
      onFormSubmit: () =>
        onUpdate({
          url: encodeURI(linkifyIt.match(url)[0].url),
          text,
          entityKey
        }),
      onUrlChange: e => this.setFormFieldState('url', e.target.value),
      onTextChange: e => this.setFormFieldState('text', e.target.value)
    }
    const editOptionProps = {
      url,
      text,
      change: () => {
        this.edit(true)
        onEdit && onEdit()
      },
      remove: () => onRemove({ entityKey })
    }

    return (
      <Manager>
        <Popper
          placement={popoverOnTop ? 'top-start' : 'bottom-start'}
          referenceElement={anchorEl}
        >
          {({ ref, style, placement, arrowProps }) => (
            <div
              onMouseDown={this.onSelfClick}
              className={styles.wrapper}
              ref={ref}
              style={style}
              data-placement={placement}
            >
              <span
                ref={arrowProps.ref}
                style={arrowProps.style}
                className={cn(styles.popperArrow, {
                  [styles.hidePopperArrow]: !editing
                })}
              />
              {editing ? (
                <EditForm {...editFormProps} />
              ) : (
                <EditOptions {...editOptionProps} />
              )}
            </div>
          )}
        </Popper>
      </Manager>
    )
  }
}
