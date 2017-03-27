import { mount } from 'enzyme';
import React from 'react'
import { loadMemberSuggestions } from '../../api/test'

class ExampleComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { profile : null, isLoading: true}
  }

  componentDidMount() {
    console.log('entered in componentDidMount..')
    
  }

  componentWillReceiveProps(nextProps) {
    console.log('entered in componentWillReceiveProps..')
    loadMemberSuggestions('vikasrohit')
  }

  render() {
    const { isLoading , profile } = this.state
    return (
      <div>
        { isLoading && <span>Loading...</span>}
        { !isLoading && <span>{ profile.handle }</span>}
      </div>
    )
  }
}

export default ExampleComponent