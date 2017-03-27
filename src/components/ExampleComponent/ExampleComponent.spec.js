import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import {unflatten} from 'flat'
import { mount, shallow, render } from 'enzyme'
import ExampleComponent from './ExampleComponent'

describe('<ExampleComponent />', () => {
  // console.log(require.cache[ require.resolve( '../../api/test' ) ])
  var deferred = Promise.defer();
  const loadMemberSuggestions = sinon.stub().returns(deferred.promise)
  deferred.resolve({'resp.data.result.content' : [{handle: 'vikasrohit'}]})
  require.cache[ require.resolve( '../../api/test' ) ].exports.loadMemberSuggestions = loadMemberSuggestions
  it('calls componentDidMount', () => {
    sinon.spy(ExampleComponent.prototype, 'componentDidMount')
    const wrapper = mount(<ExampleComponent />)
    wrapper.setProps({})
    expect(ExampleComponent.prototype.componentDidMount).to.have.property('callCount', 1)
    expect(wrapper.find('div > span').length).to.equal(1)
    expect(wrapper.find('div > span').text()).to.contain('vikasrohit')
  })

})