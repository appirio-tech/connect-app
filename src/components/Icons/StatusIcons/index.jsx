import React from 'react'
import ReactDOM from 'react-dom'
import IconStatusActive from '../../../assets/images/ps-active.svg'
import IconStatusDraft from '../../../assets/images/ps-draft.svg'
import IconStatusReview from '../../../assets/images/ps-in_review.svg'
import IconStatusReviewed from '../../../assets/images/ps-reviewed.svg'
import IconStatusCancelled from '../../../assets/images/ps-cancelled.svg'
import IconStatusPaused from '../../../assets/images/ps-paused.svg'
import IconStatusCompleted from '../../../assets/images/ps-completed.svg'
import './statusIcons.scss'

class StatusIcon extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { status } = this.props
        switch(status){
            case 'active':
                return <object><IconStatusActive className="active-status-icon" /></object>
            break;
            case 'draft':
                return <object><IconStatusDraft className="draft-status-icon" /></object>
            break;
            case 'in_review':
                return <object><IconStatusReview className="review-status-icon" /></object>
            break;
            case 'reviewed':
                return <object><IconStatusReviewed className="reviewed-status-icon" /></object>
            break;
            case 'cancelled':
                return <object><IconStatusCancelled className="cancelled-status-icon" /></object>
            break;
            case 'completed':
                return <object><IconStatusCompleted className="completed-status-icon" /></object>
            break;
            case 'paused':
                return <object><IconStatusPaused className="paused-status-icon" /></object>
            break;
        }
    }

}

export default StatusIcon