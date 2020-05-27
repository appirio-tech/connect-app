import React, { Component, Fragment } from 'react'
import FAQItem from './FAQItem'
import { getEntry } from '../../api/contentful'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import './FAQContainer.scss'
  

const FAQList = ({ entry }) => (
  <Fragment>
  { 
    entry.fields.items.map((item, idx) => {
      return (
        <FAQItem key={idx} item={item} />
    )})
  }
  </Fragment>
)

const EnhancedFAQContainer = spinnerWhileLoading(props => {
  return !props.isLoading
})(FAQList)

class FAQContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
        faqs: null
    }
  }

  componentWillMount() {
    getEntry(this.props.contentKey).then((entry) => {
      this.setState({ faqs: entry })
    });
  }

  render() {
    const { pageTitle } = this.props
    const { faqs } = this.state

    return (
      <div styleName="main">
        <h1 styleName="title">{pageTitle}</h1>
        <div styleName="content">
          <EnhancedFAQContainer entry={faqs} />
        </div>
      </div>
    )
  }
}

export default FAQContainer