import _ from 'lodash'

import React, { Component, PropTypes } from 'react'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import { ROLE_TOPCODER_MANAGER, ROLE_ADMINISTRATOR } from '../../config/constants'
import WorkProjectForm from './WorkProjectForm'

class CreateView extends Component {

  constructor(props) {
    super(props)
  }

  handleSelect(index, last) {
    console.log('SelectedTab: ' + index, ', LastTab: ' + last)
  }

  renderAppProjectWizard() {
    return (
      <div>Create project tab</div>
    )
  }

  renderWorkProject() {
    return (
      <WorkProjectForm />
    )
  }

  renderTabs() {
    const appProjectWizard = this.renderAppProjectWizard()
    const workProjectWizard = this.renderWorkProject()

    return (
      <div>
        <Tabs onSelect={this.handleSelect} >
          <TabList>
            <Tab>App Project</Tab>
            <Tab>Work</Tab>
          </TabList>
          <TabPanel>
            {appProjectWizard}
          </TabPanel>
          <TabPanel>
            {workProjectWizard}
          </TabPanel>
        </Tabs>
      </div>
    )
  }



  render() {
    if (_.indexOf(this.props.userRoles, ROLE_TOPCODER_MANAGER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_ADMINISTRATOR) > -1 ) {
      return this.renderTabs()
    } else {
      return this.renderAppProjectWizard()
    }
  }

}

CreateView.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

CreateView.defaultProps = {
  userRoles: ['manager']
}

export default CreateView
