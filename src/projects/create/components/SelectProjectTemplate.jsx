import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import SelectProjectTemplateCard from './SelectProjectTemplateCard'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'
import IconArrowRight from '../../../assets/icons/arrows-16px-1_tail-right.svg'

import {
  getProjectTypeByKey,
  getProjectTemplatesByCategory,
  getProjectTemplatesBySubCategory
} from '../../../helpers/templates'

import {
  caseInsensitiveSearch
} from '../../../helpers/utils'

import { DOMAIN } from '../../../config/constants'
import SearchIcon from '../../../assets/icons/ico-mobile-search-selected.svg'
import CloseSearchIcon from '../../../assets/icons/icon-x-mark.svg'

import './SelectProjectTemplate.scss'


class SelectProjectTemplate extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedGroup: {
        displayName: 'All Solutions',
      },
      searchInputValue: '',
      selectedSearchInputValue: '',
    }

    this.getProjectType = this.getProjectType.bind(this)
    this.getFilterList = this.getFilterList.bind(this)
    this.getVisibleProjectTemplatesGroup = this.getVisibleProjectTemplatesGroup.bind(this)
    this.canFilter = this.canFilter.bind(this)
  }

  /**
   * Get current project type
   */
  getProjectType() {
    const {
      projectTypeKey,
      projectTypes,
    } = this.props

    return getProjectTypeByKey(projectTypes, projectTypeKey)
  }

  /**
   * Get filter list
   */
  getFilterList() {
    const filterList = [{
      displayName: 'All Solutions',
    }]

    const {
      projectTypes,
      projectTemplates,
      projectTypeKey,
    } = this.props

    const availableProjectTemplates = getProjectTemplatesByCategory(projectTemplates, projectTypeKey, true)

    _.each(projectTypes, (pT) => {
      const visibleProjectTemplates = getProjectTemplatesBySubCategory(availableProjectTemplates, pT.key, true)
      if (visibleProjectTemplates.length > 0) {
        const projectType = _.cloneDeep(pT)
        projectType.visibleProjectTemplates = visibleProjectTemplates
        filterList.push(projectType)
      }
    })

    return filterList
  }

  /**
   * get visible project templates by group
   */
  getVisibleProjectTemplatesGroup() {
    const {
      projectTemplates,
      projectTypeKey,
      onProjectTemplateChange,
    } = this.props

    const {
      selectedGroup,
      selectedSearchInputValue
    } = this.state

    const getCardsUI = (visibleProjectTemplates) => {
      const cards = []
      visibleProjectTemplates.forEach((projectTemplate) => {
        // don't render disabled items for selection
        // don't render hidden items as well, hidden items can be reached via direct link though
        if (projectTemplate.disabled || projectTemplate.hidden) return

        if (selectedSearchInputValue) {
          let isMatch = false
          if (
            caseInsensitiveSearch(selectedSearchInputValue, projectTemplate.name) ||
            caseInsensitiveSearch(selectedSearchInputValue, projectTemplate.info)
          ) {
            isMatch = true
          } else if (projectTemplate.metadata.deliverables) {
            _.each(projectTemplate.metadata.deliverables, (d) => {
              if (caseInsensitiveSearch(selectedSearchInputValue, d.infoHTML)) {
                isMatch = true
              }
            })
          }
          if (!isMatch) {
            return
          }
        }

        const icon = <ProjectTypeIcon type={projectTemplate.icon} />
        cards.push(
          <SelectProjectTemplateCard
            icon={icon}
            projectTemplate={projectTemplate}
            key={projectTemplate.id}
            onClick={() => onProjectTemplateChange(projectTemplate)}
          />
        )
      })
      return cards
    }

    if (!this.canFilter()) {
      return [
        {
          displayName: null,
          info: null,
          cards: getCardsUI(getProjectTemplatesByCategory(projectTemplates, projectTypeKey, true))
        }
      ]
    }
    const groups = []

    _.each(this.getFilterList(), (filterGroup) => {
      if (filterGroup.displayName !== 'All Solutions') {
        if (selectedGroup.displayName === 'All Solutions') {
          groups.push({
            displayName: filterGroup.displayName,
            info: filterGroup.info,
            cards: getCardsUI(filterGroup.visibleProjectTemplates)
          })
        } else if (selectedGroup.displayName === filterGroup.displayName) {
          groups.push({
            displayName: filterGroup.displayName,
            info: filterGroup.info,
            cards: getCardsUI(filterGroup.visibleProjectTemplates)
          })
        }
      }
    } )
    return groups
  }

  /**
   * Check if can filter
   */
  canFilter() {
    const projectType = this.getProjectType()
    return projectType.metadata.filterable !== false
  }

  render() {
    const {
      selectedGroup,
      searchInputValue,
      selectedSearchInputValue,
    } = this.state
    const projectType = this.getProjectType()
    return (
      <div>
        <div className="SelectProjectTemplate">
          <h1>{ projectType.metadata.pageHeader }</h1>
          <h2>{ projectType.metadata.pageInfo }</h2>
          <div className="cards">
            {this.canFilter() && (
              <div className="project-type-group">
                {this.getFilterList().map(
                  (item, i) =>
                    (
                      <div
                        className={cn('item', {
                          selected: _.isEqual(item, selectedGroup)
                        })}
                        onClick={() => { this.setState({ selectedGroup: item }) }}
                        key={i}
                      >
                        {item.displayName}
                      </div>)
                )}
              </div>
            )}
            {this.canFilter() && (
              <div className="search-container">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search Solutions…"
                    value={searchInputValue}
                    onChange={(evt) => { this.setState({ searchInputValue: evt.target.value }) }}
                  />
                  {(searchInputValue || selectedSearchInputValue) && (
                    <button
                      className="close-search-icon"
                      onClick={() => {
                        this.setState({
                          searchInputValue: '',
                          selectedSearchInputValue: '',
                        })
                      }}
                    >
                      <CloseSearchIcon />
                    </button>
                  )}
                </div>
                <button
                  className="tc-btn tc-btn-md tc-btn-primary"
                  disabled={!searchInputValue}
                  onClick={() => { this.setState({ selectedSearchInputValue: searchInputValue }) }}
                ><SearchIcon className="search-icon" />  Search</button>
              </div>
            )}
            {this.getVisibleProjectTemplatesGroup().map(
              (templateGroup, i) =>
                (templateGroup.cards.length > 0) && (
                  <div key={i} className="card-section">
                    {templateGroup.displayName && (<span className="card-section-title">
                      {templateGroup.displayName}
                    </span>)}
                    {templateGroup.info && (<span className="card-section-sub-title">
                      {templateGroup.info}
                    </span>)}
                    {templateGroup.cards}
                  </div>
                )
            )}
          </div>
          <div className="footer">
            Looking for something else? <a href={`https://${DOMAIN}/contact?utm_source=Connect&utm_medium=Referral&utm_campaign=FooterContact`}>Get in touch with us <IconArrowRight /></a>
          </div>
        </div>
      </div>
    )
  }
}

SelectProjectTemplate.propTypes = {
  onProjectTemplateChange: PT.func.isRequired,
  projectTemplates: PT.array.isRequired,
  projectTypeKey: PT.string,
  projectTypes: PT.array.isRequired,
}

export default SelectProjectTemplate
