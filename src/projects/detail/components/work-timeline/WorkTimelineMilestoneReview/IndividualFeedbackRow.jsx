/**
 * Individual feedback view section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import cn from 'classnames'

import RichTextEditable from '../../../../../components/RichTextEditable/RichTextEditable'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import EditIcon from  '../../../../../assets/icons/icon-edit-black.svg'
import StarIcon from  '../../../../../assets/icons/icon-star.svg'
import StarIconSolid from  '../../../../../assets/icons/icon-star-solid.svg'
import { markdownToHTML } from '../../../../../helpers/markdownToState'
import {
  MILESTONE_TYPE,
} from '../../../../../config/constants'
import styles from './IndividualFeedbackRow.scss'


class IndividualFeedbackRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowFeedbackForm: false,
      isShowWorkPopup: false,
    }

    this.updateCheckpointSelected = this.updateCheckpointSelected.bind(this)
    this.isUpdatingAnotherFeedback = this.isUpdatingAnotherFeedback.bind(this)
    this.updateFeedback = this.updateFeedback.bind(this)

    this.setPopupWrapperRef = this.setPopupWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      indexOfDesign,
      progressIdForSelectingWorkPlace
    } = nextProps

    // close edit feedback form
    const prevIsUpdatingDesign = _.get(this.props, `isUpdatingMilestoneInfoWithProcessId.${indexOfDesign}`)
    const nextIsUpdatingDesign = _.get(nextProps, `isUpdatingMilestoneInfoWithProcessId.${indexOfDesign}`)
    const prevIsUpdatingDesignWorkPlace = _.get(this.props, `isUpdatingMilestoneInfoWithProcessId.${progressIdForSelectingWorkPlace}`)
    const nextIsUpdatingDesignWorkPlace = _.get(nextProps, `isUpdatingMilestoneInfoWithProcessId.${progressIdForSelectingWorkPlace}`)
    if (prevIsUpdatingDesign === true && nextIsUpdatingDesign === false) {
      if (prevIsUpdatingDesignWorkPlace === true && nextIsUpdatingDesignWorkPlace === false) {
        this.setState({ isShowWorkPopup: false })
      } else {
        this.setState({ isShowFeedbackForm: false })
      }
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  /**
   * Set the wrapper ref
   */
  setPopupWrapperRef(node) {
    this.popupWrapperRef = node
  }

  /**
   * Event if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.popupWrapperRef && !this.popupWrapperRef.contains(event.target)) {
      this.setState({ isShowWorkPopup: false })
    }
  }

  /**
   * is updating another feedback
   */
  isUpdatingAnotherFeedback() {
    const {
      isUpdatingMilestoneInfoWithProcessId,
      progressIdForGeneralFeedback,
    } = this.props
    for (const key in isUpdatingMilestoneInfoWithProcessId) {
      // check also if property is not inherited from prototype
      if (isUpdatingMilestoneInfoWithProcessId.hasOwnProperty(key)) {
        if (isUpdatingMilestoneInfoWithProcessId[key] && key !== progressIdForGeneralFeedback) {
          return true
        }
      }
    }
    return false
  }

  /**
   * update individual feedback
   * @param {Object} feedback feedback content
   * @param {Number} index update design feedback at index
   */
  updateFeedback(feedback, index) {
    const {
      updateWorkMilestone,
      match: { params: { workId, timelineId, milestoneId } },
      milestone,
      milestoneType,
    } = this.props

    const isFinalDesign = milestoneType === MILESTONE_TYPE.FINAL_DESIGNS
    const reviewDesigns = _.get(milestone, `details.content.${isFinalDesign ? 'finalDesigns' : 'checkpointReview'}.designs`)
    let data
    if (!reviewDesigns && !this.isUpdatingAnotherFeedback()) {
      // if index = 3 this will create `data` object with designs field: [null, null, { feedback: feedback.content }]
      // this use to init designs as array in backend
      data = _.set({}, `details.content.${isFinalDesign ? 'finalDesigns' : 'checkpointReview'}.designs.${index}.feedback`, feedback.content)
    } else {
      // if index = 3 this will create `data` object with designs field: { 3: { feedback: feedback.content } }
      // this use to update only design at index in backend api, if the designs field doesn't exist in
      // backend this will create designs as object not array so we have to call above if block first
      // to init designs field as array first
      data = { details: { content : { [isFinalDesign ? 'finalDesigns' : 'checkpointReview'] : { designs : { [index] : { feedback: feedback.content } } } } } }
    }

    updateWorkMilestone(parseInt(workId), parseInt(timelineId), parseInt(milestoneId), data, [index])
  }

  /**
   * update individual selected
   * @param {Bool} isSelected is selected
   * @param {Number} index update design selected at index
   */
  updateCheckpointSelected(isSelected, index) {
    const {
      updateWorkMilestone,
      match: { params: { workId, timelineId, milestoneId } },
      milestone,
    } = this.props
    const checkpointReviewDesigns = _.get(milestone, 'details.content.checkpointReview.designs')
    let data
    if (!checkpointReviewDesigns && !this.isUpdatingAnotherFeedback()) {
      // if index = 3 this will create `data` object with designs field: [null, null, { isSelected: isSelected }]
      // this use to init designs as array in backend
      data = _.set({}, `details.content.checkpointReview.designs.${index}.isSelected`, isSelected)
    } else {
      // if index = 3 this will create `data` object with designs field: { 3: { isSelected: isSelected } }
      // this use to update only design at index in backend api, if the designs field doesn't exist in
      // backend this will create designs as object not array so we have to call above if block first
      // to init designs field as array first
      data = { details: { content : { checkpointReview : { designs : { [index] : { isSelected } } } } } }
    }

    updateWorkMilestone(parseInt(workId), parseInt(timelineId), parseInt(milestoneId), data, [index])
  }

  /**
   * update final place selected
   * @param {Number|String} newPlace new place
   * @param {Number} index update design selected at index
   */
  updateFinalPlaceSelected(newPlace, index) {
    const {
      updateWorkMilestone,
      match: { params: { workId, timelineId, milestoneId } },
      milestone,
      designFinalReview,
      progressIdForSelectingWorkPlace,
    } = this.props

    const finalDesignsDesigns = _.get(milestone, 'details.content.finalDesigns.designs')
    const oldPlace = _.get(designFinalReview, 'place', 0)
    let expectedPlace = null
    let expectedSelected = false

    if (oldPlace !== newPlace) {
      expectedPlace = newPlace
      expectedSelected = true
    }

    let data

    if (!finalDesignsDesigns) {
      // if index = 3 this will create `data` object with designs field: [null, null, { isSelected: expectedSelected, place: expectedPlace }]
      // this use to init designs as array in backend
      data = _.set({}, `details.content.finalDesigns.designs.${index}.isSelected`, expectedSelected)
      data = _.set(data, `details.content.finalDesigns.designs.${index}.place`, expectedPlace)
    } else {
      // if index = 3 this will create `data` object with designs field: { 3: { isSelected: expectedSelected, place: expectedPlace } }
      // this use to update only design at index in backend api, if the designs field doesn't exist in
      // backend this will create designs as object not array so we have to call above if block first
      // to init designs field as array first
      data = { details: { content : { finalDesigns : { designs : { [index] : { isSelected: expectedSelected, place: expectedPlace } } } } } }
    }

    updateWorkMilestone(parseInt(workId), parseInt(timelineId), parseInt(milestoneId), data, [index, progressIdForSelectingWorkPlace])
  }

  render() {
    const {
      isUpdatingMilestoneInfoWithProcessId,
      designCheckpointReview,
      designFinalReview,
      design,
      indexOfDesign,
      milestoneType,
      alreadySelected1Place,
      alreadySelected2Place,
      alreadySelected3Place,
      progressIdForSelectingWorkPlace,
      totalDesign,
    } = this.props
    const isFinalDesign = milestoneType === MILESTONE_TYPE.FINAL_DESIGNS
    const {
      isShowFeedbackForm,
      isShowWorkPopup,
    } = this.state

    const avatar = _.get(design, 'previewUrl', '')
    const title = _.get(design, 'title', '')
    const links = _.get(design, 'links', [])
    const feedback = _.get(isFinalDesign ? designFinalReview : designCheckpointReview, 'feedback', '')
    const isCheckpointSelected = _.get(designCheckpointReview, 'isSelected', false)
    let place = _.get(designFinalReview, 'place', 0)
    const isFinalSelected = _.get(designFinalReview, 'isSelected', false)
    if (!place && isFinalSelected) {
      place = '+'
    }

    return (
      <div
        className={styles['work-row']}
      >
        <div className={styles['work-row-header']}>
          {isFinalDesign ? (
            <div
              className={styles['mulitple-works-container']}
            >
              <a
                href="javascript:;"
                type="button"
                className={cn(styles['mulitple-works-value'], { [styles['is-selected']]: isFinalSelected })}
                onClick={() => { this.setState({ isShowWorkPopup: true }) }}
              >
                <span>{place ? place : ''}</span>
              </a>
              {isShowWorkPopup && (
                <div
                  ref={this.setPopupWrapperRef}
                  className={cn(
                    styles['mulitple-works-popup'],
                    {
                      [styles['is-disable']]: isUpdatingMilestoneInfoWithProcessId[progressIdForSelectingWorkPlace]
                    }
                  )}
                >
                  <a
                    href="javascript:;"
                    className={cn(styles['mulitple-works-value'], { [styles['is-selected']]: isFinalSelected })}
                    onClick={() => { this.setState({ isShowWorkPopup: false }) }}
                  ><span>{place}</span></a>
                  <a
                    className={cn(
                      styles['mulitple-works-option'],
                      {
                        [styles['is-disabled']]: alreadySelected1Place,
                        [styles['is-selected']]: (place === 1),
                      }
                    )}
                    href="javascript:;"
                    onClick={() => { this.updateFinalPlaceSelected(1, indexOfDesign) }}
                  ><span>1</span></a>
                  {(totalDesign > 1) && (
                    <a
                      className={cn(
                        styles['mulitple-works-option'],
                        {
                          [styles['is-disabled']]: alreadySelected2Place,
                          [styles['is-selected']]: (place === 2),
                        }
                      )}
                      href="javascript:;"
                      onClick={() => { this.updateFinalPlaceSelected(2, indexOfDesign) }}
                    ><span>2</span></a>
                  )}
                  {(totalDesign > 2) && (
                    <a
                      className={cn(
                        styles['mulitple-works-option'],
                        {
                          [styles['is-disabled']]: alreadySelected3Place,
                          [styles['is-selected']]: (place === 3),
                        }
                      )}
                      href="javascript:;"
                      onClick={() => { this.updateFinalPlaceSelected(3, indexOfDesign) }}
                    ><span>3</span></a>
                  )}
                  {(totalDesign > 3) && (
                    <a
                      className={`${styles['mulitple-works-option']} ${styles['mulitple-works-add']} ${(place === '+') ? styles['is-selected'] : ''}`}
                      href="javascript:;"
                      onClick={() => { this.updateFinalPlaceSelected('+', indexOfDesign) }}
                    ><span>+</span></a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <a
              href="javascript:;"
              type="button"
              className={`${styles['icon-star']} ${isCheckpointSelected ? styles['is-selected'] : ''}`}
              onClick={() => this.updateCheckpointSelected(!isCheckpointSelected, indexOfDesign)}
            >
              {isCheckpointSelected ? (<StarIconSolid />) : (<StarIcon />)}
            </a>
          )}
          <div className={styles['work-avatar']}>
            <img src={avatar} alt="avatar"/>
          </div>
        </div>
        <div className={`${styles['work-row-content']} ${isShowFeedbackForm ? styles['is-editing'] : ''}`}>
          <div className={styles['work-row-content-header']}>
            <span>{title}</span>
            {!isShowFeedbackForm && (
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({ isShowFeedbackForm: true })
                }}
                type="button"
              >
                <EditIcon />
              </a>
            )}
          </div>
          {isShowFeedbackForm ? (
            <RichTextEditable
              className={styles['work-row-content-editor']}
              contentPlaceholder={'New feedback...'}
              content={feedback ? feedback.trim() : ''}
              cancelEdit={() => {
                this.setState({ isShowFeedbackForm: false })
              }}
              onPost={feedback => this.updateFeedback(feedback, indexOfDesign)}
              isCreating={false}
              hasPrivateSwitch={false}
              canUploadAttachment={false}
            />
          ) : (
            <div
              className={`${styles['work-row-content-content']} draftjs-post`}
              dangerouslySetInnerHTML={{__html: markdownToHTML(feedback ? feedback : 'No feedback')}}
            />
          )}

        </div>
        <div className={styles['work-row-link']}>
          <span className={styles['work-row-link-title']}>Presentation Links</span>
          {links.map(link => (
            <a
              href="javascript:;"
              key={`${link.url}-${link.title}`}
              target="_blank"
              href={link.url}
            >
              <span>{link.title}</span>
            </a>
          ))}
        </div>
        {isUpdatingMilestoneInfoWithProcessId[indexOfDesign] && (
          <div className={styles['loading-container']}>
            <LoadingIndicator />
          </div>
        )}
      </div>
    )
  }
}

IndividualFeedbackRow.defaultProps = {
  designFinalReview: {
    place: null,
    isSelected: false,
  }
}

IndividualFeedbackRow.propTypes = {
  milestone: PT.shape({
    id: PT.number,
    startDate: PT.string,
    endDate: PT.string,
    name: PT.string,
    details: PT.shape({
      content: PT.shape({
        checkpointReview: PT.shape({
          generalFeedback: PT.string
        })
      }),
      prevMilestoneContent: PT.shape({
        designs: PT.arrayOf(PT.shape({
          title: PT.string,
        }))
      })
    })
  }).isRequired,
  design: PT.shape({
    submissionId: PT.string,
    previewUrl: PT.string,
    title: PT.string,
    links: PT.arrayOf(PT.shape({
      url: PT.string,
      title: PT.string,
    }))
  }).isRequired,
  totalDesign: PT.number.isRequired,
  designCheckpointReview: PT.shape({
    feedback: PT.string,
    isSelected: PT.bool,
  }),
  designFinalReview: PT.shape({
    place: PT.oneOfType([
      PT.string,
      PT.number
    ]),
    isSelected: PT.bool,
  }),
  isUpdatingMilestoneInfoWithProcessId: PT.object.isRequired,
  updateWorkMilestone: PT.func.isRequired,
  indexOfDesign: PT.number.isRequired,
  milestoneType: PT.string.isRequired,
  alreadySelected1Place: PT.bool.isRequired,
  alreadySelected2Place: PT.bool.isRequired,
  alreadySelected3Place: PT.bool.isRequired,
  progressIdForSelectingWorkPlace: PT.number.isRequired,
  progressIdForGeneralFeedback: PT.number.isRequired,
}

export default withRouter(IndividualFeedbackRow)
