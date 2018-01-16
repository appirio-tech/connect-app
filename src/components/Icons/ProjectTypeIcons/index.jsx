import React from 'react'
import IconAnalyticsAlgorithmOptimization from '../../../assets/images/product-analytics-algorithm-optimization.svg'
import IconAnalyticsComputerVision from '../../../assets/images/product-analytics-computer-vision.svg'
import IconAnalyticsDataExploration from '../../../assets/images/product-analytics-data-exploration.svg'
import IconAnalyticsPredictiveAnalytics from '../../../assets/images/product-analytics-predictive-analytics.svg'
import IconAppApp from '../../../assets/images/product-app-app.svg'
import IconCatAnalytics from '../../../assets/images/product-cat-analytics.svg'
import IconCatApp from '../../../assets/images/product-cat-app.svg'
import IconCatChatbot from '../../../assets/images/product-cat-chatbot.svg'
import IconCatDesign from '../../../assets/images/product-cat-design.svg'
import IconCatDevelopment from '../../../assets/images/product-cat-development.svg'
import IconCatQa from '../../../assets/images/product-cat-qa.svg'
import IconCatWebsite from '../../../assets/images/product-cat-website.svg'
import IconChatbotChatbot from '../../../assets/images/product-chatbot-chatbot.svg'
import IconChatbotWatson from '../../../assets/images/product-chatbot-watson.svg'
import IconDesignAppVisual from '../../../assets/images/product-design-app-visual.svg'
import IconDesignInfographic from '../../../assets/images/product-design-infographic.svg'
import IconDesignOther from '../../../assets/images/product-design-other.svg'
import IconDesignWireframes from '../../../assets/images/product-design-wireframes.svg'
import IconDevFrontendDev from '../../../assets/images/product-dev-front-end-dev.svg'
import IconDevIntegration from '../../../assets/images/product-dev-integration.svg'
import IconDevOther from '../../../assets/images/product-dev-other.svg'
import IconDevPrototype from '../../../assets/images/product-dev-prototype.svg'
import IconOtherDesign from '../../../assets/images/product-other-design.svg'
import IconQaConsulting from '../../../assets/images/product-qa-consulting.svg'
import IconQaCrowdTesting from '../../../assets/images/product-qa-crowd-testing.svg'
import IconQaDigitalAccessability from '../../../assets/images/product-qa-digital-accessability.svg'
import IconQaHelthCheck from '../../../assets/images/product-qa-health-check.svg'
import IconQaMobilityTesting from '../../../assets/images/product-qa-mobility-testing.svg'
import IconQaOsAutomation from '../../../assets/images/product-qa-os-automation.svg'
import IconQaWebsitePrerfomance from '../../../assets/images/product-qa-website-performance.svg'
import IconWebsiteWebsite from '../../../assets/images/product-website-website.svg'


class ProjectTypeIcons extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { type } = this.props
    switch(type){
    case 'product-analytics-algorithm-optimization':
      return <object><IconAnalyticsAlgorithmOptimization className="icon-analytics-algorithm-optimization"/></object>
    case 'product-analytics-computer-vision':
      return <object><IconAnalyticsComputerVision className="icon-analytics-computer-vision"/></object>
    case 'product-analytics-data-exploration':
      return <object><IconAnalyticsDataExploration className="icon-analytics-data-exploration"/></object>
    case 'product-analytics-predictive-analytics':
      return <object><IconAnalyticsPredictiveAnalytics className="icon-analytics-predictive-analytics"/></object>
    case 'product-app-app':
      return <object><IconAppApp className="icon-app-app"/></object>
    case 'product-cat-analytics':
      return <object><IconCatAnalytics className="icon-cat-analytics"/></object>
    case 'product-cat-app':
      return <object><IconCatApp className="icon-cat-app"/></object>
    case 'product-cat-chatbot':
      return <object><IconCatChatbot className="icon-cat-chatbot"/></object>
    case 'product-cat-design':
      return <object><IconCatDesign className="icon-cat-design"/></object>
    case 'product-cat-development':
      return <object><IconCatDevelopment className="icon-cat-development"/></object>
    case 'product-cat-qa':
      return <object><IconCatQa className="icon-cat-qa"/></object>
    case 'product-cat-website':
      return <object><IconCatWebsite className="icon-cat-website"/></object>
    case 'product-chatbot-chatbot':
      return <object><IconChatbotChatbot className="icon-chatbot-chatbot"/></object>
    case 'product-chatbot-watson':
      return <object><IconChatbotWatson className="icon-chatbot-watson"/></object>
    case 'product-design-app-visual':
      return <object><IconDesignAppVisual className="icon-design-app-visual"/></object>
    case 'product-design-infographic':
      return <object><IconDesignInfographic className="icon-design-infographic"/></object>
    case 'product-design-other':
      return <object><IconDesignOther className="icon-design-other"/></object>
    case 'product-design-wireframes':
      return <object><IconDesignWireframes className="icon-design-wireframes"/></object>
    case 'product-dev-front-end-dev':
      return <object><IconDevFrontendDev className="icon-dev-frontend-dev"/></object>
    case 'product-dev-integration':
      return <object><IconDevIntegration className="icon-dev-integration"/></object>
    case 'product-dev-other':
      return <object><IconDevOther className="icon-dev-other"/></object>
    case 'product-dev-prototype':
      return <object><IconDevPrototype className="icon-dev-prototype"/></object>
    case 'product-other-design':
      return <object><IconOtherDesign  className="icon-dev-other"/></object>
    case 'product-qa-consulting':
      return <object><IconQaConsulting className="icon-qa-consulting"/></object>
    case 'product-qa-crowd-testing':
      return <object><IconQaCrowdTesting className="icon-qa-crowd-testing"/></object>
    case 'product-qa-digital-accessability':
      return <object><IconQaDigitalAccessability className="icon-qa-digital-accessability"/></object>
    case 'product-qa-health-check':
      return <object><IconQaHelthCheck className="icon-qa-health-check"/></object>
    case 'product-qa-mobility-testing':
      return <object><IconQaMobilityTesting className="icon-qa-mobility-testing"/></object>
    case 'product-qa-os-automation':
      return <object><IconQaOsAutomation className="icon-qa-os-automation"/></object>
    case 'product-qa-website-performance':
      return <object><IconQaWebsitePrerfomance className="icon-qa-website-performance"/></object>
    case 'product-website-website':
      return <object><IconWebsiteWebsite className="icon-website-website"/></object>
    default:
      return 'undefined icon'
    }
  }
}

export default ProjectTypeIcons