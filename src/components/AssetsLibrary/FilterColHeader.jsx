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
    this.state = {value: '', from: '', to: ''}
    this.setFilter = this.setFilter.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFromDateChange = this.onFromDateChange.bind(this)
    this.onToDateChange = this.onToDateChange.bind(this)
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
  
  componentDidMount() {
    this.setState({
      value: this.props.value || '',
      from: this.props.from || '',
      to: this.props.to || ''
    })
  }
  
  clearFilter() {
    this.setState({
      value: '',
      from: '',
      to: ''
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
            value={this.state.from}
          />
          <TCFormFields.TextInput
            label="To"
            type="date"
            name="date.to"
            onChange={this.onToDateChange}
            value={this.state.to}
          />
        </Formsy.Form>
      )
    }
      
    default: {
      return (
        <input
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
          <a href="javascript:;" className="dropdown-menu-header txt-link">
            {title}
            <IconCarretDownNormal className="icon-carret-down-normal"/>
          </a>
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
