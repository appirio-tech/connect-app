import _ from 'lodash'
import React, { Component} from 'react'
import classNames from 'classnames'
import FeatureList from './FeatureList'
import { Form, TextInput, TextareaInput, SubmitButton, Validations } from 'appirio-tech-react-components'

require('./DefineFeature.scss')

const categoriesList = [
  { 
    category: 'Custom Features',
    icon    : require('./images/custom-features.svg')
  }, {
    category: 'Login & Registration',
    icon    : require('./images/login-reg.svg')
  }, {
    category: 'General Building Blocks',
    icon    : require('./images/general-building-blocks.svg')
  }, {
    category: 'Ecommerce',
    icon    : require('./images/ecommerce.svg')
  }, {
    category: 'Social',
    icon    : require('./images/social.svg')
  }
]

const features = [
  {
    category: 'Login & Registration',
    id: 'EMAIL LOGIN',
    title: 'Email Login',
    description: 'Allow users to register and log in using their email address and a password. Users can also change their password or recover a forgotten one.',
    notes: null,
    custom: null,
    icon: require('./images/help-me.svg'),
    selected: false
  },
  {
    category: 'Login & Registration',
    id: 'SOCIAL LOGIN',
    title: 'Social Login',
    description: 'Allow users to register and log in using third-party services such as Facebook, Twitter, and Google. Please specify below the ones that you would like to use.',
    notes: null,
    custom: null,
    icon: require('./images/security-minimal.svg'),
    selected: false
  },
  {
    category: 'Login & Registration',
    id: 'INVITATIONS',
    title: 'Invitations',
    description: 'Allow users to invite others to use your app. This functionality is especially useful if you are building a social application or provide incentives for users to invite their friends. Invitations can be sent via email or text message. Please specify your preference below.',
    notes: null,
    custom: null,
    icon: require('./images/login-reg.svg'),
    selected: false
  }, {
    category: 'Login & Registration',
    id: 'INTRODUCTIONS',
    title: 'Introductions',
    description: 'Present your app and inform users of core functionality using a series of introductory screens before they sign up.',
    notes: null,
    custom: null,
    icon: require('./images/location.svg'),
    selected: false
  }, {
    category: 'Login & Registration',
    id: 'ONBOARDING',
    title: 'Onboarding',
    description: 'Virtually walk your users through your application. This functionality is especially useful if you need new users to set up an account or express preferences after they sign up.',
    notes: null,
    custom: null,
    icon: require('./images/social.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'SEARCH',
    title: 'Search',
    description: 'Provide the ability to search your app for specific content, such as products, members, or locations. Please specify below if you also would like autocomplete--suggesting appropriate search terms as a user starts typing.',
    notes: null,
    custom: null,
    icon: require('./images/ecommerce.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'GEOLOCATION FEATURES',
    title: 'Geolocation Features',
    description: 'Add this feature if your app has any geographic location-based functionality, such as showing store locations on a map or illustrating the progress of a delivery. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/payments.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'CAMERA (AUDIO & VIDEO)',
    title: 'Camera (Audio & Video)',
    description: 'Add this feature if your app will require using the camera to capture audio or video. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/notifications.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'FILE UPLOAD',
    title: 'File Upload',
    description: 'Allow users to upload photos or other files. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'NOTIFICATIONS',
    title: 'Notifications',
    description: 'Take advantage of notifications; for example, remind users to do certain tasks or update them on new content. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'SHARING',
    title: 'Sharing',
    description: 'Allow users to share content from your app using common options, such as email, text message, or Facebook. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'TAGS',
    title: 'Tags',
    description: 'Allow users to tag products, people or content; for example, in order to classify and easily retrieve notes. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'ADMIN FUNCTIONALITY',
    title: 'Admin Functionality',
    description: 'Add this feature if your app will have users that serve as administrators and require special access rights. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'ACCOUNT SETTINGS',
    title: 'Account Settings',
    description: 'Allow your users to adjust settings or specify preferences, such as communication frequency. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'DASHBOARD',
    title: 'Dashboard',
    description: 'Customize your users’ home screen with personalized content or basic performance indicators, such as number of wins or progress toward a goal. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'General Building Blocks',
    id: 'HELP',
    title: 'Help',
    description: 'Include a section dedicated to FAQ or Help content.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Ecommerce',
    id: 'MARKETPLACE',
    title: 'Marketplace',
    description: 'Allow users to buy, sell, or rent products or services. Please provide details below regarding how your marketplace should work. ',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Ecommerce',
    id: 'RATINGS & REVIEWS',
    title: 'Ratings & Reviews',
    description: 'Let users rate or review people, products, or services. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Ecommerce',
    id: 'PAYMENTS',
    title: 'Payments',
    description: 'Allow users to pay in some way; for example, using credit cards, PayPal, or Bitcoin. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Ecommerce',
    id: 'SHOPPING CART',
    title: 'Shopping Cart',
    description: 'Allow users to save items before purchasing. Please specify your desired usage below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Ecommerce',
    id: 'PRODUCT LISTING',
    title: 'Product Listing',
    description: 'Add this feature to shows lists of product or services, with individual detail pages for each one. Please specify below your desired usage and the information you would like in a product listing.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Social',
    id: 'ACTIVITY FEED',
    title: 'Activity Feed',
    description: 'Show your users an activity feed of some kind, as they’re used to seeing on Facebook and Twitter, for example. Please specify below your desired usage and the information that a user should see in the activity feed.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Social',
    id: 'PROFILES',
    title: 'Profiles',
    description: 'Add this feature if your app requires users to have a profile, including the ability to edit it. Please specify below your desired usage and the information you need in the profile.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }, {
    category: 'Social',
    id: 'MESSAGING',
    title: 'Messaging',
    description: 'Allow direct communication between two or more users. Please specify your desired functionality below.',
    notes: null,
    custom: null,
    icon: require('./images/audio.svg'),
    selected: false
  }
]

const customFeatureTemplate = {
  category: 'Custom Features',
  id: null,
  title: null,
  description: null,
  notes: null,
  custom: true,
  fileIds: []
}

const filterByCategory = (list, category) => {
  return list !== null ? list.filter((feature) => {
    return feature.category === category
  }) : []
}

class DefineFeature extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFeaturesCount : 0,
      activeFeature: null,
      customFeature : null,
      showDefineFeaturesForm: true,
      updatedFeatures : [] //initialize from work service or get from props
    }
    this.activateFeature = this.activateFeature.bind(this)
    this.toggleDefineFeatures = this.toggleDefineFeatures.bind(this)
    this.addCustomFeature = this.addCustomFeature.bind(this)
    this.hideCustomFeatures = this.hideCustomFeatures.bind(this)
    this.onChange = this.onChange.bind(this)
    this.applyFeature = this.applyFeature.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
    this.saveFeatures = this.saveFeatures.bind(this)
  }

  activateFeature(feature) {
    this.setState({
      activeFeature : feature,
      customFeature : _.assign({}, customFeatureTemplate),
      showDefineFeaturesForm : false,
      addingCustomFeature : false,
      activePreview : require('./images/' + feature.title + '.png')
    })
  }

  toggleDefineFeatures() {
    this.setState({
      activeFeature : null,
      addingCustomFeature : true,
      showDefineFeaturesForm : !this.state.showDefineFeaturesForm
    })
  }

  hideCustomFeatures() {
    this.setState({
      showDefineFeaturesForm : false
    })
  }

  saveFeatures() {
    console.log(this.state.updatedFeatures)
  }

  onChange() {
    // TODO get latest from server and normalize the reponse
  }

  applyFeature(submittedFeature) {
    const { activeFeature, updatedFeatures } = this.state
    _.merge(activeFeature, submittedFeature)
    activeFeature.selected = true

    features.forEach((feature) => {
      if(feature.id === activeFeature.id) {
        updatedFeatures.push(feature)
      }
    })
    this.forceUpdate()
    this.onChange()
  }

  removeFeature() {
    const { updatedFeatures, activeFeature } = this.state
    updatedFeatures.forEach((feature, index) => {
      if(feature.title === activeFeature.title) {
        updatedFeatures.splice(index, 1)
      }
    })

    this.setState({ activeFeature : null })
    this.onChange()
  }

  addCustomFeature() {
    const { updatedFeatures, customFeature } = this.state
    const valid = customFeature.title && customFeature.description && this.customNameUnique()

    if (valid) {
      updatedFeatures.push(customFeature)
      this.hideCustomFeatures()
      this.onChange()
    }
  }

  customNameUnique() {
    const { customFeature } = this.state
    // let featureTitleError = false
    let unique = true

    features.forEach((feature) => {
      if (customFeature.title && customFeature.title.toLowerCase() === feature.title.toLowerCase()) {
        // featureTitleError = true
        unique = false
      }
    })

    return unique
  }

  renderFeatureForm() {
    const { activeFeature, showDefineFeaturesForm } = this.state
    const { readOnly } = this.props
    let activeFeatureDom = null
    if (!showDefineFeaturesForm && !activeFeature) {
      activeFeatureDom = (
        <div className="default active">
          <h3>Select and define features for your app</h3>
          <p>Select from the most popular features, listed on the left, or define your own custom features.</p>
        </div>
      )
    }
    const selected = _.get(activeFeature, 'selected')
    const submitAction = !selected ? this.applyFeature : this.removeFeature
    const buttonText = !selected ? 'Add this feature' : 'Remove feature'
    if (!showDefineFeaturesForm && activeFeature) {
      activeFeatureDom = (
        <div className="description active">
          <h3>{ activeFeature.title }</h3>
          <p>{ activeFeature.description }</p>
          <TextareaInput
            name="notes"
            label="Notes"
            placeholder="Notes..."
            disabled={ readOnly }
            wrapperClass="row"
          />
          <div className="button-area">
            <SubmitButton className="tc-btn tc-btn-primary tc-btn-md" disabled={ readOnly }>{ buttonText }</SubmitButton>
          </div>
        </div>
      )
    }
    return (
      <Form initialValue={ activeFeature } resetOnRender={ true } disableOnPristine={ false} onSubmit={ submitAction }>
        { activeFeatureDom }
      </Form>
    )
  }

  renderCustomFeatureForm() {
    const { customFeature, showDefineFeaturesForm } = this.state
    const { readOnly } = this.props
    const custFeatureClasses = classNames('new-feature', {
      active: showDefineFeaturesForm
    })
    return (
      <div className={ custFeatureClasses }>
        <Form initialValue={ customFeature } onSubmit={ this.addCustomFeature }>
          <h3>Define a new feature</h3>
          <TextInput
            name="title"
            type="text"
            validations={{
              required: [Validations.isRequired, 'feature name is required']
              //TODO add unique validation
            }}
            label="Feature name"
            placeholder="enter feature name"
            disabled={readOnly}
            wrapperClass="row"
          />

          <TextareaInput
            name="description"
            label="Feature Description"
            placeholder="Briefly describe the feature, including how it will be used, and provide examples that will help designers and developers understand it."
            disabled={readOnly}
            wrapperClass="row"
          />

          <div className="button-area">
            <SubmitButton className="tc-btn tc-btn-primary tc-btn-md" disabled={ readOnly }>Add</SubmitButton>
            <button type="button" className="tc-btn tc-btn-secondary tc-btn-md cancel" onClick={ this.hideCustomFeatures }>Cancel</button>
          </div>
        </Form>
      </div>
    )
  }

  renderPreview() {
    const { activeFeature, activePreview, addingCustomFeature } = this.state
    let previewImg = null
    // if feature is activated and is not a customer feature
    if (activeFeature && !activeFeature.custom) {
      previewImg = activePreview
    } else if ((activeFeature && activeFeature.custom) || addingCustomFeature) { // if active/non-active custom feature
      previewImg = require('./images/Custom-feature.png')
    } else {
      previewImg = require('./images/Default-preview.png')
    }
    return (
      <div className="example flex-grow">
        <img src={ previewImg } />
      </div>
    )
  }

  render() {
    const { activeFeature, updatedFeatures } = this.state
    const { readOnly } = this.props
    const selectedFeaturesCount = updatedFeatures ? updatedFeatures.length : 0

    const renderFeatureCategory = (category, idx) => {
      const featuresToRender = filterByCategory(features, category.category)
      if (featuresToRender.length === 0) {
        return null
      }
      return (
        <li key={ idx }>
          <FeatureList
            icon={ category.icon }
            activeFeature={ activeFeature}
            headerText={ category.category }
            features={ featuresToRender }
            onFeatureSelection={ this.activateFeature }
          />
        </li>
      )
    }

    return (
      <div className="define-features">
        <h2><strong>Features</strong></h2>
        <main className="flex flex-grow">
          <ul className="features flex column">
            <li ignore-content="true" className="flex-grow">
              <ul className="feature-categories-list">
                { categoriesList.map(renderFeatureCategory) }
              </ul>
            </li>
            <li>
              <button className="tc-btn-primary" onClick={ this.toggleDefineFeatures } disabled={ readOnly }>
                <span>Define a new feature</span>
                <div className="icon">+</div>
              </button>
            </li>
          </ul>
          <ul className="contents flex column flex-grow">
            <li className="flex flex-grow">
              { this.renderFeatureForm() }
              { this.renderCustomFeatureForm() }
              { this.renderPreview() }
            </li>
            <li className="flex middle space-between">
              <div className="count">{ selectedFeaturesCount } features added</div>
              <button onClick={ this.saveFeatures } disabled={ readOnly } className="tc-btn tc-btn-primary tc-btn-md action">Save</button>
            </li>
          </ul>
        </main>
      </div>
    )
  }
}

export default DefineFeature