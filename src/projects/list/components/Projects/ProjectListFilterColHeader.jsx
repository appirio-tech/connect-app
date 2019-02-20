import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import IconCarretDownNormal from '../../../../assets/icons/arrow-6px-carret-down-normal.svg'

class ProjectListFilterColHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.setFilter = this.setFilter.bind(this)
    this.onChange = this.onChange.bind(this)
    // debounced setFilter function to prevent polluting server with requests
    this.debouncedSetFilterCheck = _.debounce(this.setFilter, 500)
  }

  setFilter(newfilter) {
    this.props.setFilter(this.props.filterName, newfilter)
  }

  onChange(event) {
    this.setState({ value: event.target.value }, () => {
      this.debouncedSetFilterCheck(this.state.value)
    })
  }

  componentDidMount() {
    this.setState({
      value: this.props.value || ''
    })
  }

  render() {
    const {
      title
    } = this.props

    return (
      <div>
        <Dropdown className="filter-drop-down" noAutoclose>
          <a href="javascript:;" className="dropdown-menu-header txt-link">
            {title}
            <IconCarretDownNormal className="icon-carret-down-normal"/>
          </a>
          <div className="dropdown-menu-list down-layer">
            <input type="text" name="filter" className="tc-file-field__inputs" onChange={this.onChange} value={this.state.value}/>
          </div>
        </Dropdown>
      </div>
    )
  }
}

ProjectListFilterColHeader.propTypes = {
  title: PropTypes.string,
  filterName: PropTypes.string,
  setFilter: PropTypes.func,
  value: PropTypes.string
}
export default ProjectListFilterColHeader
