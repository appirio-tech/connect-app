/**
 * WorkItemList stages section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import DropdownItem from 'appirio-tech-react-components/components/Dropdown/DropdownItem'

import DeletePopup from './DeletePopup'
import { getSubtrackAbbreviation } from '../../../../helpers'
import { getWorkItemStartEndDate } from '../../../../helpers/workstreams'
import { DIRECT_PROJECT_URL } from '../../../../config/constants'
import './WorkItemList.scss'


class WorkItemList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeletePopup: false,
      workIsDeleting: {},
    }

    this.confirmDeleteWorkitem = this.confirmDeleteWorkitem.bind(this)
  }

  /**
   * Delete work item
   */
  confirmDeleteWorkitem() {
    const { showDeletePopup } = this.state
    const {
      match: { params: { projectId, workstreamId, workId } },
      startDeleteWorkitem,
      deleteWorkitem
    } = this.props
    startDeleteWorkitem(showDeletePopup.id)
    deleteWorkitem(projectId, workstreamId, workId, showDeletePopup.id)
  }

  render() {
    const { showDeletePopup } = this.state
    const { workitems, workItemsIsDeleting } = this.props
    return (
      <div styleName="container">
        {workitems.length ? (<table styleName="table">
          <thead>
            <tr>
              <th>Challenge</th>
              <th>Start</th>
              <th>End</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {workitems.map((item) => {
              const { startDate, endDate } = getWorkItemStartEndDate(item)
              return (
                <tr key={item.id}>
                  <td>
                    <div styleName="challenge-cell">
                      <span styleName="logo">{item.productTemplate ? getSubtrackAbbreviation(item.productTemplate.icon.substr(10)) : ''}</span>
                      <div styleName="cell-right">
                        <span styleName="challenge-name">{item.name}</span>
                        <span styleName="type">{item.productTemplate ? item.productTemplate.name : ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>{startDate ? startDate.format('MMM D') : ''}</td>
                  <td>{endDate ? endDate.format('MMM D') : ''}</td>
                  <td>
                    <a
                      href={`${DIRECT_PROJECT_URL}${_.get(item, 'details.challengeId', 0)}`}
                      className="tc-btn tc-btn-default tc-btn-sm"
                      disabled={workItemsIsDeleting[item.id]}
                      target="_blank"
                    >Manage Details</a>
                  </td>
                  <td>
                    {(workItemsIsDeleting[item.id])
                      ? (<span styleName="text-deleting">Deleting</span>)
                      : (
                        <Dropdown
                          styleName="dropdown"
                          pointerShadow className="drop-down edit-toggle-container"
                        >
                          <div className="dropdown-menu-header edit-toggle" title="Edit">
                            <div styleName="edit-toggle-btn"><i/><i/><i/></div>
                          </div>
                          <div className="dropdown-menu-list down-layer">
                            <ul>
                              {! this.props.hideDelete &&
                              <DropdownItem key={2} item={{label: 'Delete', val:'2'}}
                                onItemClick={() => { this.setState({ showDeletePopup: item })}}
                                currentSelection=""
                              /> }
                            </ul>
                          </div>
                        </Dropdown>)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>) : (
          <div styleName="no-challenge-container">
            <span styleName="no-challenge-text">No design challenge/task created</span>
          </div>
        )}
        {showDeletePopup && (
          <DeletePopup
            header="Are you sure you want to delete this work item?"
            body="This action cannot be undone."
            deleteButton="Delete Work Item"
            onCancelClick={() => { this.setState({showDeletePopup: false}) }}
            onDeleteClick={() => {
              this.confirmDeleteWorkitem()
              this.setState({showDeletePopup: false})
            }}
          />
        )}
      </div>
    )
  }
}

WorkItemList.defaultProps = {
}

WorkItemList.propTypes = {
  workitems: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
  })).isRequired,
  workItemsIsDeleting: PT.object.isRequired, // object that contain deleting workitem with format {[workitemid]: false/true}
  deleteWorkitem: PT.func.isRequired,
  startDeleteWorkitem: PT.func.isRequired,
}

export default withRouter(WorkItemList)
