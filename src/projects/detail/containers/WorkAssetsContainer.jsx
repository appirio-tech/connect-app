import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import LinksGridView from '../../../components/AssetsLibrary/LinksGridView'
import FilesGridView from '../../../components/AssetsLibrary/FilesGridView'
import AssetsStatistics from '../../../components/AssetsLibrary/AssetsStatistics'
import {
  extractAttachmentLinksFromPosts,
  extractLinksFromPosts,
} from '../../../helpers/posts'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'

import './WorkAssetsContainer.scss'

const formatModifyDate = (link) => ((link.updatedAt) ? moment(link.updatedAt).format('MM/DD/YYYY h:mm A') : '—')
const formatFolderTitle = (linkTitle) => linkTitle

class WorkAssetsContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeAssetsType: 'Files',
    }

    this.activeAssetsTypeChange = this.activeAssetsTypeChange.bind(this)
  }

  activeAssetsTypeChange(assetsType) {
    this.setState({ activeAssetsType: assetsType })
  }

  render() {
    const {
      workTopics,
      loggedInUser,
      isLoadingTopic,
    } = this.props
    const {
      activeAssetsType,
    } = this.state

    // extract links from posts
    const links = extractLinksFromPosts(workTopics)
    // extract attachment from posts
    const attachments = extractAttachmentLinksFromPosts(workTopics)

    const assetsData = [
      { name: 'Files', total: _.toString(attachments.length) },
      { name: 'Links', total: _.toString(links.length) }
    ]

    return (
      <div>
        <div styleName="assets-info-wrapper">
          <AssetsStatistics
            assetsData={assetsData}
            onClickAction={this.activeAssetsTypeChange}
            activeAssetsType={activeAssetsType}
          />
          {isLoadingTopic && (<LoadingIndicator />)}
          {activeAssetsType === 'Files' && !isLoadingTopic && (
            <FilesGridView
              links={attachments}
              title="Files"
              loggedInUser={loggedInUser}
              formatModifyDate={formatModifyDate}
              formatFolderTitle={formatFolderTitle}
            />
          )}
          {activeAssetsType === 'Links' && !isLoadingTopic && (
            <LinksGridView
              links={links}
              formatModifyDate={formatModifyDate}
              formatFolderTitle={formatFolderTitle}
            />
          )}
        </div>
      </div>
    )
  }
}

WorkAssetsContainer.PropTypes = {
  workTopics: PT.array,
  loggedInUser: PT.object.isRequired,
  isLoadingTopic: PT.bool.isRequired,
}

const mapStateToProps = ({ loadUser, topics }) => {
  const isLoadingTopic = _.some(_.values(topics), { isLoading: true })

  return ({
    loggedInUser: loadUser.user,
    isLoadingTopic,
  })
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(WorkAssetsContainer)
