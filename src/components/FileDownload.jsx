import React from 'react'
import { getProjectAttachment } from '../api/projectAttachments'
import { withRouter } from 'react-router-dom'

class FileDownload extends React.Component {

  constructor(props) {
    super(props)
    this.state={loaded:false, error:null}
    
  }

  componentWillMount() {
    this.download()
  }

  download() {
    const projectId = this.props.match.params.projectId
    const attachmentId = this.props.match.params.attachmentId
    getProjectAttachment(projectId, attachmentId).then((url) => {
      window.location = url
    }).catch(() => {
      this.setState({loaded:true, error:'File unavailable'})
    })
  }

  render() {
    

    return (
      <div >
        {!this.state.loaded ? 'Loading...':this.state.error}
      </div>
    )
  }
}

export default withRouter(FileDownload)