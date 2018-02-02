import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'react-addons-update'
import PickerFeatureList from './PickerFeatureList'
// import FeatureForm from './FeatureForm'
import DefaultFeatureForm from './DefaultFeatureForm'
import CustomFeatureForm from './CustomFeatureForm'
import FeaturePreview from './FeaturePreview'
import IconLoginReg from '../../../../assets/icons/login-reg.svg'
import IconGeneralBuildingBlocks from '../../../../assets/icons/general-building-blocks.svg'
import IconEcommerce from '../../../../assets/icons/ecommerce.svg'
import IconSocial from '../../../../assets/icons/social.svg'
import IconCustomFeatures from '../../../../assets/icons/custom-features.svg'
import IconSecurityMinimal from '../../../../assets/icons/security-minimal.svg'
import IconLocation from '../../../../assets/icons/location.svg'
import IconPayment from '../../../../assets/icons/payments.svg'
import IconNotifications from '../../../../assets/icons/notifications.svg'
import IconAudio from '../../../../assets/icons/audio.svg'

require('./FeaturePicker.scss')



const categoriesList = [
  {
    id: 'login_registration',
    label: 'Login & Registration',
    order: 1,
    icon: IconLoginReg
  }, {
    id: 'general_building_blocks',
    label: 'General Building Blocks',
    order: 2,
    icon: IconGeneralBuildingBlocks
  }, {
    id: 'ecommerce',
    label: 'Ecommerce',
    order: 3,
    icon: IconEcommerce
  }, {
    id: 'social',
    label: 'Social',
    order: 4,
    icon: IconSocial
  }, {
    id: 'custom',
    label: 'Custom Features',
    order: 5,
    icon: IconCustomFeatures
  }
]

const AVAILABLE_FEATURES = [
  {
    categoryId: 'login_registration',
    id: 'email_login',
    title: 'Email Login',
    description: 'Allow users to register and log in using their email address and a password. Users can also change their password or recover a forgotten one.',
    custom: null,
    icon: IconLoginReg
  },
  {
    categoryId: 'login_registration',
    id: 'social_login',
    title: 'Social Login',
    description: 'Allow users to register and log in using third-party services such as Facebook, Twitter, and Google. Please specify below the ones that you would like to use.',
    icon: IconSecurityMinimal
  },
  {
    categoryId: 'login_registration',
    id: 'invitations',
    title: 'Invitations',
    description: 'Allow users to invite others to use your app. This functionality is especially useful if you are building a social application or provide incentives for users to invite their friends. Invitations can be sent via email or text message. Please specify your preference below.',
    icon: IconLoginReg
  }, {
    categoryId: 'login_registration',
    id: 'introductions',
    title: 'Introductions',
    description: 'Present your app and inform users of core functionality using a series of introductory screens before they sign up.',
    icon: IconLocation
  }, {
    categoryId: 'login_registration',
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Virtually walk your users through your application. This functionality is especially useful if you need new users to set up an account or express preferences after they sign up.',
    icon: IconSocial
  }, {
    categoryId: 'general_building_blocks',
    id: 'search',
    title: 'Search',
    description: 'Provide the ability to search your app for specific content, such as products, members, or locations. Please specify below if you also would like autocomplete--suggesting appropriate search terms as a user starts typing.',
    icon: IconEcommerce
  }, {
    categoryId: 'general_building_blocks',
    id: 'geolocation_features',
    title: 'Geolocation Features',
    description: 'Add this feature if your app has any geographic location-based functionality, such as showing store locations on a map or illustrating the progress of a delivery. Please specify your desired functionality below.',
    icon: IconPayment
  }, {
    categoryId: 'general_building_blocks',
    id: 'camera_audio_video',
    title: 'Camera (Audio & Video)',
    description: 'Add this feature if your app will require using the camera to capture audio or video. Please specify your desired usage below.',
    icon: IconNotifications
  }, {
    categoryId: 'general_building_blocks',
    id: 'file_upload',
    title: 'File Upload',
    description: 'Allow users to upload photos or other files. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'notifications',
    title: 'Notifications',
    description: 'Take advantage of notifications; for example, remind users to do certain tasks or update them on new content. Please specify your desired functionality below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'sharing',
    title: 'Sharing',
    description: 'Allow users to share content from your app using common options, such as email, text message, or Facebook. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'tags',
    title: 'Tags',
    description: 'Allow users to tag products, people or content; for example, in order to classify and easily retrieve notes. Please specify your desired functionality below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'admin_functionality',
    title: 'Admin Functionality',
    description: 'Add this feature if your app will have users that serve as administrators and require special access rights. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'account_settings',
    title: 'Account Settings',
    description: 'Allow your users to adjust settings or specify preferences, such as communication frequency. Please specify your desired functionality below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Customize your users’ home screen with personalized content or basic performance indicators, such as number of wins or progress toward a goal. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'general_building_blocks',
    id: 'help',
    title: 'Help',
    description: 'Include a section dedicated to FAQ or Help content.',
    icon: IconAudio
  }, {
    categoryId: 'ecommerce',
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Allow users to buy, sell, or rent products or services. Please provide details below regarding how your marketplace should work. ',
    icon: IconAudio
  }, {
    categoryId: 'ecommerce',
    id: 'rations_reviews',
    title: 'Ratings & Reviews',
    description: 'Let users rate or review people, products, or services. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'ecommerce',
    id: 'payments',
    title: 'Payments',
    description: 'Allow users to pay in some way; for example, using credit cards, PayPal, or Bitcoin. Please specify your desired functionality below.',
    icon: IconAudio
  }, {
    categoryId: 'ecommerce',
    id: 'shopping_cart',
    title: 'Shopping Cart',
    description: 'Allow users to save items before purchasing. Please specify your desired usage below.',
    icon: IconAudio
  }, {
    categoryId: 'ecommerce',
    id: 'product_listing',
    title: 'Product Listing',
    description: 'Add this feature to shows lists of product or services, with individual detail pages for each one. Please specify below your desired usage and the information you would like in a product listing.',
    icon: IconAudio
  }, {
    categoryId: 'social',
    id: 'activity_feed',
    title: 'Activity Feed',
    description: 'Show your users an activity feed of some kind, as they’re used to seeing on Facebook and Twitter, for example. Please specify below your desired usage and the information that a user should see in the activity feed.',
    icon: IconAudio
  }, {
    categoryId: 'social',
    id: 'profiles',
    title: 'Profiles',
    description: 'Add this feature if your app requires users to have a profile, including the ability to edit it. Please specify below your desired usage and the information you need in the profile.',
    icon: IconAudio
  }, {
    categoryId: 'social',
    id: 'messaging',
    title: 'Messaging',
    description: 'Allow direct communication between two or more users. Please specify your desired functionality below.',
    icon: IconAudio
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
      showCutsomFeatureForm: false,
      addingCustomFeature: false
    }
    this.addFeature = this.addFeature.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.selectFeature = this.selectFeature.bind(this)
    this.updateSelectedFeature = this.updateSelectedFeature.bind(this)
    this.renderCustomFeatureForm = this.renderCustomFeatureForm.bind(this)
    this.renderDefaultFeatureForm = this.renderDefaultFeatureForm.bind(this)
  }

  componentWillMount() {
    this.setState({
      activeFeatureList: this.props.features,
      activeFeatureCount: this.props.features.length
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      addingCustomFeature : this.state.addingCustomFeature && this.props.features.length === nextProps.features.length
    })
  }

  renderCustomFeatureForm() {
    this.setState({
      selectedFeatureId: null,
      showCutsomFeatureForm: true,
      addingCustomFeature: true
    })
  }

  renderDefaultFeatureForm() {
    this.setState({
      selectedFeatureId: null,
      showCutsomFeatureForm: false,
      addingCustomFeature: false
    })
  }

  updateSelectedFeature(feature) {
    const idx = _.findIndex(this.state.activeFeatureList, f => f.id === feature.id )
    const newState = update(this.state, {
      activeFeatureList: { $splice: [[idx, 1, feature]]}
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  toggleFeature(featureId, disable) {
    const featureIndex = _.findIndex(this.state.activeFeatureList, (f) => f.id === featureId )
    if (featureIndex >= 0) {
      const feature = this.state.activeFeatureList[featureIndex]
      let featureListQuery
      // separate update query for custom and standard features
      // when disabling, we remove standard feature from the list while update custom feature with disabled flag
      if (feature.categoryId === 'custom') {
        feature.disabled = disable
        featureListQuery = { $splice : [[featureIndex, 1, feature]] }
      } else {
        featureListQuery = { $splice: [[featureIndex, 1]] }
      }
      const newState = update(this.state, {
        activeFeatureCount: { $set: this.state.activeFeatureCount - 1 },
        activeFeatureList: featureListQuery,
        selectedFeatureId: { $set : feature.id }
      })
      this.setState(newState)
      this.props.onSave(newState.activeFeatureList)
    }
  }

  addFeature(feature) {
    const newState = update(this.state, {
      activeFeatureCount: {$set: this.state.activeFeatureCount + 1},
      activeFeatureList: { $push : [feature] },
      selectedFeatureId: { $set : feature.id }
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  // removeFeature is only called for custom feature
  removeFeature(featureId) {
    // lookup index
    const idx = _.findIndex(this.state.activeFeatureList, f => f.id === featureId )
    const newState = update(this.state, {
      activeFeatureCount: {$set: this.state.activeFeatureCount - 1},
      activeFeatureList: { $splice: [[idx, 1]] },
      showCutsomFeatureForm: { $set : false },
      selectedFeatureId: { $set : null }
    })
    this.setState(newState)
    this.props.onSave(newState.activeFeatureList)
  }

  selectFeature(selectedFeature) {
    this.setState({
      selectedFeatureId : selectedFeature.id,
      showCutsomFeatureForm : selectedFeature.categoryId === 'custom'
    })
  }
  //----------------------------------------

  render() {
    const { selectedFeatureId, activeFeatureList, activeFeatureCount, showCutsomFeatureForm, addingCustomFeature  } = this.state
    const { isEdittable } = this.props
    const selectedFeature = _.find(AVAILABLE_FEATURES, f => f.id === selectedFeatureId )
    const selectedFeatureData = _.find(activeFeatureList, f => f.id === selectedFeatureId )
    const renderFeatureCategory = (category, idx) => {
      return (
        <li key={ idx }>
          <PickerFeatureList
            category={ category }
            features={ categorizedFeatureSet[category.id] || []}
            selectedFeatureId={ selectedFeatureId }
            activeFeatureList={ activeFeatureList }
            onSelectFeature={ this.selectFeature }
          />
        </li>
      )
    }
    const defaultFeatureForm = selectedFeatureId ? (
      <DefaultFeatureForm
        isEdittable={isEdittable}
        featureDesc={selectedFeature}
        featureData={selectedFeatureData}
        updateFeature={this.updateSelectedFeature}
        toggleFeature={ this.toggleFeature }
        addFeature={this.addFeature}
        removeFeature={this.removeFeature}
      />
    ) : (
      <div className="feature-form-instructions">
        <h3>Select and define features for your app</h3>
        <p>Select from the most popular features, listed on the left, or define your own custom features.</p>
      </div>
    )

    return (
      <div className="define-features">
        <h2>Project Features <span className="selected-feature-count">- {activeFeatureCount || 0} selected</span></h2>
        <main className="flex space-between">
          <div className="features flex column">
            { addingCustomFeature && <div className="features-overlay" /> }
            <ul className="feature-categories-list">
              { categoriesList.map(renderFeatureCategory) }
              { !addingCustomFeature &&
                <li className="add-custom-feature">
                  <div className="custom-feature-btn-desc">Create your custom feature if you don’t see the one you need in the list.</div>
                  <button className="tc-btn-secondary tc-btn-sm" onClick={ this.renderCustomFeatureForm }>
                    <span>Add a custom feature</span>
                  </button>
                </li>
              }
            </ul>
          </div>
          <div className="contents features-content flex column flex-grow">
            {
              showCutsomFeatureForm ? (
                <CustomFeatureForm
                  isEdittable={isEdittable}
                  featureData={selectedFeatureData}
                  updateFeature={this.updateSelectedFeature}
                  toggleFeature={ this. toggleFeature }
                  addFeature={this.addFeature}
                  removeFeature={this.removeFeature}
                  onCancel={this.renderDefaultFeatureForm}
                />
              ) : defaultFeatureForm
            }
          </div>
          <div className="contents flex column">
            <FeaturePreview feature={ selectedFeature } addingCustomFeature={ showCutsomFeatureForm } />
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
