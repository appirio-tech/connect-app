import _ from 'lodash'
import React, { Component} from 'react'
import PickerFeatureList from './PickerFeatureList'
import FeatureForm from './FeatureForm'
import FeaturePreview from './FeaturePreview'

require('./FeaturePicker.scss')

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

const AVAILABLE_FEATURES = [
  {
    category: 'Login & Registration',
    id: 'EMAIL LOGIN',
    title: 'Email Login',
    description: 'Allow users to register and log in using their email address and a password. Users can also change their password or recover a forgotten one.',
    notes: null,
    custom: null,
    icon: require('./images/login-reg.svg'),
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

class FeaturePicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      features : props.addedFeatures || [],
      selectedFeaturesCount : 0,
      activeFeature: null,
      showCutsomFeatureForm: false,
      updatedFeatures : []
    }
    this.activateFeature = this.activateFeature.bind(this)
    this.applyFeature = this.applyFeature.bind(this)
    this.addCustomFeature = this.addCustomFeature.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
    this.onChange = this.onChange.bind(this)
    this.saveFeatures = this.saveFeatures.bind(this)
    this.toggleDefineFeatures = this.toggleDefineFeatures.bind(this)
  }

  toggleDefineFeatures() {
    this.setState({
      activeFeature : null,
      addingCustomFeature : true,
      showCutsomFeatureForm : !this.state.showCutsomFeatureForm
    })
  }

  activateFeature(feature) {
    this.setState({
      activeFeature : feature,
      showCutsomFeatureForm : false,
      addingCustomFeature : false
    })
  }

  applyFeature(submittedFeature) {
    const { activeFeature, updatedFeatures } = this.state
    submittedFeature.title = activeFeature.title
    submittedFeature.description = activeFeature.description

    updatedFeatures.push(submittedFeature)
    this.forceUpdate()
  }

  removeFeature() {
    const { updatedFeatures, activeFeature } = this.state
    updatedFeatures.forEach((feature, index) => {
      if(feature.title === activeFeature.title) {
        // feature.selected = false
        updatedFeatures.splice(index, 1)
      }
    })

    this.setState({ activeFeature : null })
    // this.onChange()
  }

  addCustomFeature(model) {
    const { updatedFeatures } = this.state
    const valid = model.title && model.description && this.customNameUnique(model)

    if (valid) {
      const customFeature = _.assign({}, customFeatureTemplate, model)
      model.custom = true
      updatedFeatures.push(model)
      this.setState({
        activeFeature : customFeature,
        addingCustomFeature : false,
        showCutsomFeatureForm : false
      })
    }
  }

  saveFeatures() {
    const { features, updatedFeatures } = this.state
    this.props.onSave(features.concat(updatedFeatures))
  }

  customNameUnique(customFeature) {
    const { features } = this.state
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

  render() {
    const { features, activeFeature, updatedFeatures, showCutsomFeatureForm, addingCustomFeature } = this.state
    const { readOnly } = this.props
    const allAddedFeatures = features.concat(updatedFeatures)
    const selectedFeaturesCount = allAddedFeatures.length

    const renderFeatureCategory = (category, idx) => {
      let featuresToRender = []
      if (category.category === 'Custom Features') {
        featuresToRender = allAddedFeatures.filter((f) => { return f.custom === true })
      } else {
        featuresToRender = filterByCategory(AVAILABLE_FEATURES, category.category)
      }
      if (featuresToRender.length === 0) {
        return null
      }
      return (
        <li key={ idx }>
          <PickerFeatureList
            icon={ category.icon }
            activeFeature={ activeFeature}
            headerText={ category.category }
            features={ featuresToRender }
            addedFeatures={ allAddedFeatures }
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
            <li className="flex-grow">
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
              <FeatureForm
                feature={ activeFeature }
                addedFeatures={ allAddedFeatures }
                showCutsomFeatureForm={ showCutsomFeatureForm }
                onAddFeature={ this.applyFeature }
                onRemoveFeature={ this.removeFeature }
                onAddCustomFeature={ this.addCustomFeature }
              />
              <FeaturePreview feature={ activeFeature } addingCustomFeature={ addingCustomFeature } />
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

FeaturePicker.AVAILABLE_FEATURES = AVAILABLE_FEATURES

export default FeaturePicker