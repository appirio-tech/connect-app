import React, { PropTypes } from 'react'
import _ from 'lodash'
import filepicker from 'filepicker-js'
require('./FilePicker.scss')

class FilePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = { dragText : props.options.dragText }
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    this.props.onSuccess(this.props.options.multiple ? event.fpfiles : event.fpfile)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dragText : nextProps.options.dragText })
  }

  componentDidMount() {
    const filepickerElement = this.refs.filepicker
    const filepickerButton = this.refs.filepickerButton
    const filepickerProgress = this.refs.filepickerProgress
    filepicker.setKey(this.props.apiKey)
    const opts = _.assign({}, this.props.options)
    opts.container = opts.storeContainer
    opts.dragEnter = () => {
      this.setState({ dragText : 'Drop to upload'})
      filepickerElement.classList.add('drag-entered')
    }
    opts.dragLeave = () => {
      this.setState({ dragText : opts.dragText })
      filepickerElement.classList.remove('drag-entered')
    }
    opts.onSuccess = (files) => {
      this.setState({ dragText : opts.dragText })
      filepickerElement.classList.remove('in-progress')
      this.props.onSuccess(this.props.options.multiple ? files : files[0])
    }
    opts.onError = () => {
      filepickerElement.classList.remove('in-progress')
      this.setState({ dragText : opts.dragText })
    }
    opts.onProgress = (percentage) => {
      filepickerElement.classList.remove('drag-entered')
      filepickerElement.classList.add('in-progress')
      filepickerProgress.style.width = percentage + '%'
    }
    filepicker.makeDropPane(filepickerElement, opts)
    filepicker.constructWidget(filepickerButton)
    filepickerElement.addEventListener('change', this.onChange, false)
  }

  componentWillUnmount() {
    this.refs.filepicker.removeEventListener('change', this.onChange, false)
  }

  render() {
    const { mode, options } = this.props
    const { dragText } = this.state

    // add data-fp- prefix to all keys
    const opts = _.mapKeys(options, (v, k) => {
      const hyphenated = k.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
      return `data-fp-${hyphenated}`
    })
    return (
      <div ref="filepicker" className="filepicker">
        <input type={mode} onChange={this.onChange} {...opts} />
        <div className="filepicker-drag-drop-pane">
          <span className="filepicker-drag-drop-text">{ dragText }</span>
          <input type="filepicker" ref="filepickerButton" className="filepicker-picker" {...opts} />
        </div>
        <div className="filepicker-progress" ref="filepickerProgress"></div>
      </div>
    )
  }
}

FilePicker.propTypes = {
  apiKey: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default FilePicker
