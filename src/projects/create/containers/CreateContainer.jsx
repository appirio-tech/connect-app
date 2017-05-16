import React from 'react'
// import { connect } from 'react-redux'
import ProjectWizard from '../components/ProjectWizard'

// require('./CreateProject.scss')

const CreateView = () => (
  <div>
    <ProjectWizard closeModal={false} />
  </div>
)

class CreateConainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <CreateView {...this.props} />
  }
}

// const mapStateToProps = ({ projectState }) => {
//   return {
//     isLoading      : projectState.isLoading
//   }
// }

export default CreateConainer
// export default connect(mapStateToProps)(CreateConainer)
