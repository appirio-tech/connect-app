import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import update from 'react-addons-update'
import PickerFeatureList from './PickerFeatureList'
// import FeatureForm from './FeatureForm'
import DefaultFeatureForm from './DefaultFeatureForm'
import FeaturePreview from './FeaturePreview'

require('./FeaturePicker.scss')

const categoriesList = [
  {
    id: 'login_registration',
    label: 'Login & Registration',
    order: 1,
    icon: require('./images/login-reg.svg')
  }, {
    id: 'general_building_blocks',
    label: 'General Building Blocks',
    order: 2,
    icon: require('./images/general-building-blocks.svg')
  }, {
    id: 'ecommerce',
    label: 'Ecommerce',
    order: 3,
    icon    : require('./images/ecommerce.svg')
  }, {
    id: 'social',
    label: 'Social',
    order: 4,
    icon: require('./images/social.svg')
  }, {
    id: 'custom',
    label: 'Custom Features',
    order: 5,
    icon: require('./images/custom-features.svg')
  }
]

const AVAILABLE_FEATURES = [
  {
    categoryId: 'login_registration',
    id: 'email_login',
    title: 'Email Login',
    description: 'Allow users to register and log in using their email address and a password. Users can also change their password or recover a forgotten one.',
    custom: null,
    icon: require('./images/login-reg.svg')
  },
  {
    categoryId: 'login_registration',
    id: 'social_login',
    title: 'Social Login',
    description: 'Allow users to register and log in using third-party services such as Facebook, Twitter, and Google. Please specify below the ones that you would like to use.',
    icon: require('./images/security-minimal.svg')
  },
  {
    categoryId: 'login_registration',
    id: 'invitations',
    title: 'Invitations',
    description: 'Allow users to invite others to use your app. This functionality is especially useful if you are building a social application or provide incentives for users to invite their friends. Invitations can be sent via email or text message. Please specify your preference below.',
    icon: require('./images/login-reg.svg')
  }, {
    categoryId: 'login_registration',
    id: 'introductions',
    title: 'Introductions',
    description: 'Present your app and inform users of core functionality using a series of introductory screens before they sign up.',
    icon: require('./images/location.svg')
  }, {
    categoryId: 'login_registration',
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Virtually walk your users through your application. This functionality is especially useful if you need new users to set up an account or express preferences after they sign up.',
    icon: require('./images/social.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'search',
    title: 'Search',
    description: 'Provide the ability to search your app for specific content, such as products, members, or locations. Please specify below if you also would like autocomplete--suggesting appropriate search terms as a user starts typing.',
    icon: require('./images/ecommerce.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'geolocation_features',
    title: 'Geolocation Features',
    description: 'Add this feature if your app has any geographic location-based functionality, such as showing store locations on a map or illustrating the progress of a delivery. Please specify your desired functionality below.',
    icon: require('./images/payments.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'camera_audio_video',
    title: 'Camera (Audio & Video)',
    description: 'Add this feature if your app will require using the camera to capture audio or video. Please specify your desired usage below.',
    icon: require('./images/notifications.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'file_upload',
    title: 'File Upload',
    description: 'Allow users to upload photos or other files. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'notifications',
    title: 'Notifications',
    description: 'Take advantage of notifications; for example, remind users to do certain tasks or update them on new content. Please specify your desired functionality below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'sharing',
    title: 'Sharing',
    description: 'Allow users to share content from your app using common options, such as email, text message, or Facebook. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'tags',
    title: 'Tags',
    description: 'Allow users to tag products, people or content; for example, in order to classify and easily retrieve notes. Please specify your desired functionality below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'admin_functionality',
    title: 'Admin Functionality',
    description: 'Add this feature if your app will have users that serve as administrators and require special access rights. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'account_settings',
    title: 'Account Settings',
    description: 'Allow your users to adjust settings or specify preferences, such as communication frequency. Please specify your desired functionality below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Customize your users’ home screen with personalized content or basic performance indicators, such as number of wins or progress toward a goal. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'general_building_blocks',
    id: 'help',
    title: 'Help',
    description: 'Include a section dedicated to FAQ or Help content.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'ecommerce',
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Allow users to buy, sell, or rent products or services. Please provide details below regarding how your marketplace should work. ',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'ecommerce',
    id: 'rations_reviews',
    title: 'Ratings & Reviews',
    description: 'Let users rate or review people, products, or services. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'ecommerce',
    id: 'payments',
    title: 'Payments',
    description: 'Allow users to pay in some way; for example, using credit cards, PayPal, or Bitcoin. Please specify your desired functionality below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'ecommerce',
    id: 'shopping_cart',
    title: 'Shopping Cart',
    description: 'Allow users to save items before purchasing. Please specify your desired usage below.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'ecommerce',
    id: 'product_listing',
    title: 'Product Listing',
    description: 'Add this feature to shows lists of product or services, with individual detail pages for each one. Please specify below your desired usage and the information you would like in a product listing.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'social',
    id: 'activity_feed',
    title: 'Activity Feed',
    description: 'Show your users an activity feed of some kind, as they’re used to seeing on Facebook and Twitter, for example. Please specify below your desired usage and the information that a user should see in the activity feed.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'social',
    id: 'profiles',
    title: 'Profiles',
    description: 'Add this feature if your app requires users to have a profile, including the ability to edit it. Please specify below your desired usage and the information you need in the profile.',
    icon: require('./images/audio.svg')
  }, {
    categoryId: 'social',
    id: 'messaging',
    title: 'Messaging',
    description: 'Allow direct communication between two or more users. Please specify your desired functionality below.',
    icon: require('./images/audio.svg')
  }
]
const categorizedFeatureSet = _.groupBy(AVAILABLE_FEATURES, val => val.categoryId)

// const customFeatureTemplate = {
//   categoryId: 'custom',
//   id: null,
//   title: null,
//   description: null,
//   notes: null,
//   fileIds: []
// }

class FeaturePicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFeatureId: null,
      activeFeatureCount: 0,
      activeFeatureList : [],
      addingCustomFeature: false,
      showCutsomFeatureForm: false
    }
    this.addFeature = this.addFeature.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
    this.selectFeature = this.selectFeature.bind(this)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.updateSelectedFeature = this.updateSelectedFeature.bind(this)
  }

  componentWillMount() {
    this.setState({
      activeFeatureList: this.props.features,
      activeFeatureCount: this.props.features.length
    })
  }

  toggleFeature(featureId) {
    const idx = _.findIndex(this.state.activeFeatureList, f => f.id === featureId)
    idx > -1 ? this.removeFeature(featureId) : this.addFeature(featureId)
  }

  updateSelectedFeature(feature) {
    const idx = _.findIndex(this.state.activeFeatureList, f => f.id === feature.id )
    const newState = update(this.state, {
      activeFeatureList: { $splice: [[idx, 1, feature]]}
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  addFeature(feature) {
    const newState = update(this.state, {
      activeFeatureCount: {$set: this.state.activeFeatureCount + 1},
      activeFeatureList: { $push : [feature] }
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  removeFeature(featureId) {
    // lookup index
    const idx = _.findIndex(this.state.activeFeatureList, f => f.id === featureId )
    const newState = update(this.state, {
      activeFeatureCount: {$set: this.state.activeFeatureCount - 1},
      activeFeatureList: { $splice: [[idx, 1]] }
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  selectFeature(selectedFeatureId) {
    this.setState({ selectedFeatureId })
  }
  //----------------------------------------

  render() {
    const { selectedFeatureId, activeFeatureList, activeFeatureCount, addingCustomFeature  } = this.state
    const { isEdittable } = this.props
    const selectedFeature = _.find(AVAILABLE_FEATURES, f => f.id === selectedFeatureId )
    const selectedFeatureData = _.find(activeFeatureList, f => f.id === selectedFeatureId )
    const renderFeatureCategory = (category, idx) => {
      return (
        <li key={ idx }>
          <PickerFeatureList
            icon={ category.icon }
            headerText={ category.label }
            features={ categorizedFeatureSet[category.id] || []}
            selectedFeatureId={ selectedFeatureId }
            activeFeatureList={ activeFeatureList }
            onSelectFeature={ this.selectFeature }
          />
        </li>
      )
    }

    return (
      <div className="define-features">
        <h2><strong>Project Features - {activeFeatureCount || 0} selected</strong></h2>
        <main className="flex flex-grow">
          <div className="features flex column">
            <ul className="feature-categories-list">
              { categoriesList.map(renderFeatureCategory) }
            </ul>
            {/*
            <li>
              <button className="tc-btn-primary" onClick={ this.toggleDefineFeatures } disabled={ readOnly }>
                <span>Define a new feature</span>
                <div className="icon">+</div>
              </button>
            </li>
            */}
          </div>
          <div className="contents flex column flex-grow">
            { selectedFeatureId ?
                 <DefaultFeatureForm
                   isEdittable={isEdittable}
                   featureDesc={selectedFeature}
                   featureData={selectedFeatureData}
                   updateFeature={this.updateSelectedFeature}
                   addFeature={this.addFeature}
                   removeFeature={this.removeFeature}
                 />
                : <p>Some default text should go here</p>
              }
          </div>
          <div className="contents flex column flex-grow">
            <FeaturePreview feature={ selectedFeature } addingCustomFeature={ addingCustomFeature } />
          </div>
        </main>
      </div>
    )
  }
}

FeaturePicker.AVAILABLE_FEATURES = AVAILABLE_FEATURES
FeaturePicker.ALL_FEATURES_MAP = _.keyBy(AVAILABLE_FEATURES, 'id')

FeaturePicker.PropTypes = {
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  idEdittable: PropTypes.bool.isRequired
}

FeaturePicker.defaultProps = {
  features: []
}
export default FeaturePicker
