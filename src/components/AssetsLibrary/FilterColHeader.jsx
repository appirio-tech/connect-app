import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import IconCarretDownNormal from '../../assets/icons/arrow-6px-carret-down-normal.svg'
import './FilterColHeader.scss'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'

const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields

class FilterColHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {value: '', from: '', to: '', name: '', tag: ''}
    this.setFilter = this.setFilter.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFromDateChange = this.onFromDateChange.bind(this)
    this.onToDateChange = this.onToDateChange.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onTagChange = this.onTagChange.bind(this)
  }

  setFilter(newfilter) {
    this.props.setFilter(this.props.filterName, newfilter)
  }

  onChange(event) {
    this.setState({value: event.target.value})

    setTimeout(() => {
      this.setFilter(this.state.value)
    })
  }

  onFilterClick() {
    if(this.textInputFilter){
      setTimeout(() => this.textInputFilter.focus())
    }
  }
  
  onFromDateChange(name, value) {
    this.setState({from: value})

    setTimeout(() => {
      this.props.setFilter('date.from', this.state.from)
    })
  }

  onToDateChange(name, value) {
    this.setState({to: value})

    setTimeout(() => {
      this.props.setFilter('date.to', this.state.to)
    })
  }

  onNameChange(name, value) {
    this.setState({ name: value})

    setTimeout(() => {
      this.props.setFilter('name.name', this.state.name)
    })
  }

  onTagChange(name, value) {
    this.setState({tag: value})

    setTimeout(() => {
      this.props.setFilter('name.tag', this.state.tag)
    })
  }

  componentDidMount() {
    this.setState({
      value: this.props.value || '',
      from: this.props.from || '',
      to: this.props.to || '',
      name: this.props.name || '',
      tag: this.props.tag || ''
    })
  }

  clearFilter() {
    this.setState({
      value: '',
      from: '',
      to: '',
      name: '',
      tag: ''
    })
  }

  renderByType() {
    switch (this.props.type) {
    case 'date': {
      return (
        <Formsy.Form>
          <TCFormFields.TextInput
            label="From"
            type="date"
            name="date.from"
            onChange={this.onFromDateChange}
            maxValue={this.state.to}
            value={this.state.from}
          />
          <TCFormFields.TextInput
            label="To"
            type="date"
            name="date.to"
            onChange={this.onToDateChange}
            minValue={this.state.from}
            value={this.state.to}
          />
        </Formsy.Form>
      )
    }

    case 'name': {
      return (
        <Formsy.Form>
          <TCFormFields.TextInput
            inputRef={(input) => { this.textInputFilter = input }}
            label="Name"
            type="text"
            name="name.name"
            onChange={this.onNameChange}
            value={this.state.name}
          />

          <TCFormFields.TextInput
            label="Tag"
            type="text"
            name="name.tag"
            onChange={this.onTagChange}
            value={this.state.tag}
          />
        </Formsy.Form>
      )
    }

    default: {
      return (
        <input
          ref={(input) => { this.textInputFilter = input }}
          type="text"
          name="filter"
          className="tc-file-field__inputs"
          onChange={this.onChange}
          value={this.state.value}
        />
      )
    }
    }
  }

  render() {
    const {
      title,
    } = this.props

    return (
      <div styleName="FilterColHeader">
        <Dropdown className="filter-drop-down" noAutoclose>
          <div className="dropdown-menu-header">
            <a href="javascript:;" className="txt-link" onClick={this.onFilterClick.bind(this)}>
              {title}
              <IconCarretDownNormal className="icon-carret-down-normal"/>
            </a>
          </div>
          <div className="dropdown-menu-list down-layer">
            {this.renderByType()}
          </div>
        </Dropdown>
      </div>
    )
  }
}

FilterColHeader.propTypes = {
  title: PropTypes.string,
  filterName: PropTypes.string,
  setFilter: PropTypes.func,
  value: PropTypes.string,
  type: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string
}
export default FilterColHeader
