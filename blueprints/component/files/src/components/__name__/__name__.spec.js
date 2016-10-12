import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import <%= pascalEntityName %> from './<%= pascalEntityName %>';

describe.skip('(Component) <%= pascalEntityName %>', () => {
  let _props;
  let _spies;
  let _wrapper;

  beforeEach(() => {
    _spies = {};
    _props = {
      foo: false,
      bar: (_spies.bar = sinon.spy()),
    };
  });

  it('Should render as a <div>.', () => {
    _wrapper = shallow(<<%= pascalEntityName %> {..._props} />);
    expect(_wrapper.is('div')).to.be.true;
  });

  it('Should invoke bar on button click', () => {
    _wrapper = mount(<<%= pascalEntityName %> {..._props} />);
    _wrapper.find('Button').simulate('click');
    _spies.bar.should.have.been.calledWith({
      baz: 'baz2',
    });
  });
});
