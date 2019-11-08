import React from 'react'
import Sticky from 'react-stickynode'
import MediaQuery from 'react-responsive'
import TwoColsLayout from '../../../components/TwoColsLayout'
import MetadataSidebar from './MetadataSidebar'

import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'

import './MetaDataLayout.scss'

class MetaDataLayout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TwoColsLayout noPadding>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return (
                  <Sticky top={60}>
                    <MetadataSidebar/>
                  </Sticky>
                )
              } else {
                return <MetadataSidebar/>
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          {this.props.main}
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

export default MetaDataLayout
