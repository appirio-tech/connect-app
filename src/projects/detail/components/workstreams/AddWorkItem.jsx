/**
 * AddWorkItem stages section
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { SwitchButton } from 'appirio-tech-react-components'

import CloseIcon from  '../../../../assets/icons/x-mark-black.svg'
import BackIcon from  '../../../../assets/icons/arrows-16px-1_tail-left.svg'
import SearchIcon from  '../../../../assets/icons/ui-16px-1_zoom.svg'
import CheckIcon from  '../../../../assets/icons/check-white.svg'
import AddColor from '../../../../assets/icons/icon-add-color.svg'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import { CHALLENGE_LIST_PER_PAGE, DOMAIN } from '../../../../config/constants'
import { getChallengeStartEndDate } from '../../../../helpers/challenges'
import './AddWorkItem.scss'


class AddWorkItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedChallenges: {},
      showChallengesForThisProjectOnly: false,
      searchQuery: '',
    }
    this.getDashboardUrl = this.getDashboardUrl.bind(this)
    this.selectChallenge = this.selectChallenge.bind(this)
    this.isSelectedAnyChallenge = this.isSelectedAnyChallenge.bind(this)
    this.loadingMore = this.loadingMore.bind(this)
    this.toggleThisProjectOnly = this.toggleThisProjectOnly.bind(this)
    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this)
    this.resetChallengeList = this.resetChallengeList.bind(this)
    this.createWorkItem = this.createWorkItem.bind(this)
    this.debouncedHandleChangeSearchField = _.debounce(this.debouncedHandleChangeSearchField.bind(this), 200)
  }

  componentWillMount() {
    // first time loading challenges
    const { loadChallenges } = this.props
    this.resetChallengeList() // clear challenge list
    loadChallenges()
  }

  componentWillReceiveProps(nextProps) {
    const {
      onBack,
      errorWorkItem
    } = nextProps

    // backto dashboard after create work item successfully
    const prevIsCreatingWorkItem = _.get(this.props, 'isCreatingWorkItem')
    const nextIsCreatingWorkItem = _.get(nextProps, 'isCreatingWorkItem')
    if (prevIsCreatingWorkItem === true && nextIsCreatingWorkItem === false && !errorWorkItem) {
      onBack()
    }
  }

  /**
   * Get url of dashboard
   */
  getDashboardUrl() {
    const {
      match,
    } = this.props

    return `/projects/${match.params.projectId}`
  }

  /**
   * Select the challenge
   * @param {Object} challenge challenge
   */
  selectChallenge(challenge) {
    const { selectedChallenges } = this.state
    selectedChallenges[challenge.id] = selectedChallenges[challenge.id] ? false : challenge
    this.setState({ selectedChallenges })
  }

  /**
   * Check if is select any challenge
   */
  isSelectedAnyChallenge() {
    const { selectedChallenges } = this.state
    for (const property in selectedChallenges) {
      if (selectedChallenges[property]) {
        return true
      }
    }
    return false
  }

  /**
   * Load more challenge
   * @param {Number} offset offset of challenge list
   */
  loadingMore(offset) {
    const { loadChallenges, directProjectId } = this.props
    const { showChallengesForThisProjectOnly, searchQuery } = this.state
    loadChallenges(
      searchQuery,
      showChallengesForThisProjectOnly ? directProjectId : null, // direct project id
      offset
    )
  }

  /**
   * Reset list of challenge
   */
  resetChallengeList() {
    const { startLoadChallenges } = this.props
    startLoadChallenges() // clear challenge list
    this.setState({ selectedChallenges: {} })
  }

  /**
   * Toggle get challenge for this project only
   * @param {Bool} isThisProjectOnly get challenges for this project only
   */
  toggleThisProjectOnly(showChallengesForThisProjectOnly) {
    const { loadChallenges, directProjectId } = this.props
    const { searchQuery } = this.state
    this.resetChallengeList() // clear challenge list
    this.setState({ showChallengesForThisProjectOnly })
    loadChallenges(
      searchQuery,
      showChallengesForThisProjectOnly ? directProjectId : null, // direct project id
      0
    )
  }

  /**
   * When enter in search field
   * @param {Object} event input event
   */
  handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
      this.resetChallengeList()
      const inputText = this.refs.textFieldSearchRef.value
      this.setState({ searchQuery: inputText })
      this.debouncedHandleChangeSearchField(inputText) // sending only the values not the entire event
    }
  }

  /**
   * Debounced start call request after press enter in search field
   * @param {Object} event input event
   */
  debouncedHandleChangeSearchField(searchQuery) {
    const { loadChallenges, directProjectId } = this.props
    const { showChallengesForThisProjectOnly } = this.state
    loadChallenges(
      searchQuery,
      showChallengesForThisProjectOnly ? directProjectId : null, // direct project id
      0
    )
  }

  /**
   * Create work item
   */
  createWorkItem() {
    const { selectedChallenges } = this.state
    const { match: { params: { projectId, workstreamId, workId } }, createWorkitem } = this.props
    const challengeList = []
    for (const challengeId in selectedChallenges) {
      if (selectedChallenges[challengeId]) {
        challengeList.push(selectedChallenges[challengeId])
      }
    }
    createWorkitem(projectId, workstreamId, workId, challengeList)
  }

  render() {

    const {
      onBack,
      onClose,
      allChallengesCount,
      filterChallenges,
      isLoadingChallenge,
      isCreatingWorkItem,
      challenges
    } = this.props
    const { selectedChallenges, showChallengesForThisProjectOnly } = this.state

    const numberOfRemainingChallenges = allChallengesCount - challenges.length
    const numberOfNextLoading = Math.min(numberOfRemainingChallenges, CHALLENGE_LIST_PER_PAGE)
    return (
      <div
        styleName={cn(
          'container',
          {
            ['is-updating']: isCreatingWorkItem,
          }
        )}
      >
        <div styleName="header">
          <div onClick={onBack} styleName="left-control">
            <i styleName="icon" title="back"><BackIcon /></i>
            <span styleName="back-icon-text">Back</span>
          </div>
          <span styleName="title">Add Challenge or Task</span>
          <div styleName="right-control">
            <i onClick={() => {
              onClose()
              this.props.history.push(this.getDashboardUrl())
            }} styleName="icon-close"
            >
              <CloseIcon />
            </i>
          </div>
        </div>
        <div styleName="search-container">
          <SearchIcon />
          <input
            styleName="search-field"
            type="text"
            placeholder="Search challenge/task by name, id.."
            onKeyDown={this.handleSearchKeyDown}
            ref="textFieldSearchRef"
          />
        </div>
        <div styleName="filter">
          <SwitchButton
            onChange={ (e) => { this.toggleThisProjectOnly(e.target.checked) } }
            label="This project only"
            name="this-project-only"
            checked={showChallengesForThisProjectOnly}
          />
        </div>
        <div styleName="list">
          {filterChallenges.map((item) => {
            const { startDate } = getChallengeStartEndDate(item)
            return (
              <div
                key={item.id}
                styleName="row"
              >
                <i
                  styleName={cn('checkbox', {checked: selectedChallenges[item.id]})}
                  onClick={() => { this.selectChallenge(item) }}
                >
                  <CheckIcon />
                </i>
                <div styleName="column-right">
                  <span styleName="challenge-name">{item.name}</span>
                  <span styleName="start-date">Start  {startDate ? startDate.format('MMM D') : ''}</span>
                </div>
              </div>
            )
          })}
        </div>
        {isLoadingChallenge && (<LoadingIndicator />)}
        {!isLoadingChallenge && (numberOfNextLoading > 0) && (
          <button
            styleName="load-more"
            className="tc-btn tc-btn-primary tc-btn-sm"
            onClick={() => {
              this.loadingMore(challenges.length)
            }}
          >
            Show next {numberOfNextLoading} challenges
          </button>)}
        {!isLoadingChallenge && (numberOfNextLoading === 0 && filterChallenges.length > 0) && (<span styleName="end-of-list">
          End of list
        </span>)}
        {!isLoadingChallenge && (numberOfNextLoading === 0 && filterChallenges.length === 0) && (<span styleName="end-of-list">
          No challenges found
        </span>)}
        <div styleName="bottom">
          <a
            styleName="btn-create"
            href={`https://${DOMAIN}/direct/launch/home`}
            target="_blank"
          >CREATE NEW CHALLENGE/TASK</a>
          <button
            styleName="icon-add"
            className="tc-btn tc-btn-primary tc-btn-md"
            disabled={!this.isSelectedAnyChallenge()}
            onClick={this.createWorkItem}
          >
            <AddColor /> <span>Add to Work Card</span>
          </button>
        </div>
        {isCreatingWorkItem && (<div styleName="loading-for-creating">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

AddWorkItem.defaultProps = {
  onBack: () => {},
  onClose: () => {},
}

AddWorkItem.propTypes = {
  onBack: PT.func,
  onClose: PT.func,
  challenges: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
  })).isRequired,
  filterChallenges: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
  })).isRequired,
  allChallengesCount: PT.number.isRequired,
  startLoadChallenges: PT.func.isRequired,
  loadChallenges: PT.func.isRequired,
  createWorkitem: PT.func.isRequired,
  isLoadingChallenge: PT.bool.isRequired,
  isCreatingWorkItem: PT.bool.isRequired,
  errorWorkItem: PT.bool.isRequired,
}

export default withRouter(AddWorkItem)
