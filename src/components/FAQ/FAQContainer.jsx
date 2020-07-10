import React, { Component } from 'react'
import FAQItem from './FAQItem'
import { getEntry } from '../../api/contentful'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import './FAQContainer.scss'
  

const FAQList = ({ entry }) => (
  <div styleName="faq-list-container">
    { 
      entry.fields.items.map((item, idx) => {
        return (
          <FAQItem key={idx} item={item} />
        )}
      )
    }
  </div>
)

const EnhancedFAQContainer = spinnerWhileLoading(props => {
  return !props.isLoading
})(FAQList)

class FAQContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      faqs: null,
      isLoading: true
    }
  }

  componentWillMount() {
    getEntry(this.props.contentKey).then((entry) => {
      this.setState({ faqs: entry, isLoading: false })
    })
  }

  render() {
    const { pageTitle } = this.props
    const { faqs, isLoading } = this.state

    return (
      <div styleName="main">
        <h1 styleName="title">{pageTitle}</h1>
        <div styleName="content">
          <EnhancedFAQContainer entry={faqs} isLoading={isLoading} />
        </div>
      </div>
    )
  }
}

export default FAQContainer