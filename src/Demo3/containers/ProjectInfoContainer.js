import React from 'react'
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo'
import LinksMenu from '../../components/LinksMenu/LinksMenu'
import FooterV2 from '../../components/FooterV2/FooterV2'
import TeamManagementContainer from './TeamManagementContainer'

export default class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      canDeleteLinks: true,
      status: 'DRAFT',
      types: ['IPHONE', 'IPAD', 'WEB', 'APPLE_WATCH', 'ANDROID_WEAR'],
      duration: {
        percent: 0,
        text: 'Complete specification to get estimate'
      },
      budget: {
        percent: 80,
        text: '$1000 remaining'
      },
      links: [
        {id: 1, href: 'javascript:', title: 'GitHub Repo'},
        {id: 2, href: 'javascript:', title: 'InVision Prototype 1'},
        {id: 3, href: 'javascript:', title: 'InVision Prototype 2'},
        {id: 4, href: 'javascript:', title: 'InVision Final Designs'},
        {id: 5, href: 'javascript:', title: 'Link with a long description goes here, view it'},
        {id: 6, href: 'javascript:', title: 'GitHub - Topcoder Styles'},
        {id: 7, href: 'javascript:', title: 'GitHub - Topcoder React Components'},
        {id: 8, href: 'javascript:', title: 'Link 1'},
        {id: 9, href: 'javascript:', title: 'Link 2'},
        {id: 10, href: 'javascript:', title: 'Link 3'},
        {id: 11, href: 'javascript:', title: 'Link 4'},
        {id: 12, href: 'javascript:', title: 'Link 5'}
      ]
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
  }

  onChangeStatus(status) {
    this.setState({status})
  }

  onAddNewLink(link) {
    link.id = new Date().getTime()
    this.setState({links: [link, ...this.state.links]})
  }

  onDeleteLink(link) {
    this.setState({links: this.state.links.filter((item) => item.id !== link.id)})
  }
  
  render() {
    const {types, status, duration, budget, links, canDeleteLinks} = this.state
    return (
      <div>
        <ProjectInfo
          types={types}
          status={status} onChangeStatus={this.onChangeStatus}
          duration={duration}
          budget={budget}
        />
        <LinksMenu
          links={links}
          canDelete={canDeleteLinks}
          onAddNewLink={this.onAddNewLink}
          onDelete={this.onDeleteLink}
        />
        <TeamManagementContainer currentUserIndex={0} memberIndexes={[0, 1, 4]} />
        <FooterV2 />
      </div>
    )
  }
}
