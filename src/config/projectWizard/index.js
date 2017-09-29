import _ from 'lodash'
import typeToSpecification from '../projectSpecification/typeToSpecification'

const products = {
  App: {
    icon: 'product-cat-app',
    info: 'Build a phone, tablet, wearable, or desktop app',
    question: 'What do you need to develop?',
    id: 'app',
    subtypes: {
      App: {
        brief: 'Apps',
        details: 'Build apps for mobile, web, or wearables',
        icon: 'product-app-app',
        id: 'application_development'
      }
    }
  },
  Website: {
    icon: 'product-cat-website',
    info: 'Design and build the high-impact pages for your blog, online store, or company',
    question: 'What do you need to develop?',
    id: 'website',
    subtypes: {
      Website: {
        brief: 'Websites',
        details: 'Build responsive or regular websites',
        icon: 'product-website-website',
        id: 'website_development'
      }
    }
  },
  Chatbot: {
    icon: 'product-cat-chatbot',
    info: 'Build a cognitive chat bot for your product',
    question: 'What do you need to develop?',
    id: 'chatbot',
    subtypes: {
      'Watson Chatbot': {
        brief: 'Watson Chatbot',
        details: 'Build Chatbot using IBM Watson',
        icon: 'product-chatbot-chatbot',
        id: 'watson_chatbot'
      }
    }
  },
  Design: {
    icon: 'product-cat-design',
    info: 'Pick the right design project for your needs - wireframes, visual, or other',
    question: 'What kind of design do you need?',
    id: 'visual_design',
    subtypes: {
      Wireframes: {
        brief: '10-15 screens',
        details: 'Plan and explore the navigation and structure of your app',
        icon: 'product-design-wireframes',
        id: 'wireframes'
      },
      'App Visual Design - Concepts': {
        brief: '1-15 screens',
        details: 'Visualize and test your app requirements and ideas',
        icon: 'product-design-app-visual',
        id: 'visual_design_concepts',
        disabled: true
      },
      'Visual Design': {
        brief: '1-15 screens',
        details: 'Create development-ready designs',
        icon: 'product-design-app-visual',
        id: 'visual_design_prod'
      },
      Infographic: {
        brief: 'Infographic',
        details: 'Present your data in an easy-to-understand and interesting way',
        icon: 'product-design-infographic',
        id: 'infographic',
        disabled: true
      },
      'Other Design': {
        brief: 'other designs',
        details: 'Get help with other types of design',
        icon: 'product-design-other',
        id: 'generic_design'
      }
    }
  },
  'Software Development' : {
    icon: 'product-cat-development',
    info: 'Get help with any part of your development lifecycle',
    question: 'What kind of development do you need?',
    id: 'app_dev',
    subtypes: {
      'Front-end Prototype': {
        brief: '3-20 screens',
        details: 'Translate designs to a web (HTML/CSS/JavaScript) or mobile prototype',
        icon: 'product-dev-prototype',
        id: 'visual_prototype',
        disabled: true
      },
      'Front-end': {
        brief: '',
        details: 'Translate your designs into Web or Mobile front-end',
        icon: 'product-dev-front-end-dev',
        id: 'frontend_dev'
      },
      'Back-end & API': {
        brief: '',
        details: 'Build the server, DB, and API for your app',
        icon: 'product-dev-integration',
        id: 'api_dev'
      },
      'Development Integration': {
        brief: 'Tasks or adhoc',
        details: 'Get help with any part of your app or software',
        icon: 'product-dev-other',
        id: 'generic_dev'
      }
    }
  },
  'Crowd Testing': {
    icon: 'product-qa-crowd-testing',
    info: 'Exploratory Testing, Cross browser-device Testing',
    question: 'What kind of quality assurance (QA) do you need?',
    id: 'quality_assurance',
    subtypes: {
      'Crowd Testing': {
        brief: 'TBD',
        details: 'Exploratory Testing, Cross browser-device Testing',
        icon: 'product-qa-crowd-testing',
        id: 'crowd_testing'
      },
      'Mobility Testing': {
        brief: 'TBD',
        details: 'App Certification, Lab on Hire, User Sentiment Analysis',
        icon: 'product-qa-mobility-testing',
        id: 'mobility_testing',
        disabled: true
      },
      'Website Performance': {
        brief: 'TBD',
        details: 'Webpage rendering effiency, Load, Stress and Endurance Test',
        icon: 'product-qa-website-performance',
        id: 'website_performance',
        disabled: true
      },
      'Digital Accessability': {
        brief: 'TBD',
        details: 'Make sure you app or website conforms to all rules and regulations',
        icon: 'product-qa-digital-accessability',
        id: 'digital_accessability',
        disabled: true
      },
      'Open Source Automation': {
        brief: 'TBD',
        details: 'Exploratory testing, cross browser testing',
        icon: 'product-qa-os-automation',
        id: 'open_source_automation',
        disabled: true
      },
      'Consulting & Adivisory': {
        brief: 'TBD',
        details: 'Expert services to get your project covered end-to-end',
        icon: 'product-qa-consulting',
        id: 'consulting_adivisory',
        disabled: true
      }
    }
  }
}

export default products

export function findProduct(product) {
  if (product === 'generic_dev') {
    return 'Development'
  }
  if (product === 'generic_design') {
    return 'Design'
  }
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      if (products[pType].subtypes[prd].id === product) {
        return prd
      }
    }
  }
}

export function findCategory(categoryId) {
  for(const key in products) {
    if (products[key].id === categoryId) {
      return { ...products[key], name: key} 
    }
  }
  return null
}

export function findProductsOfCategory(category) {
  for(const pType in products) {
    if (products[pType].id === category) {
      const ret = []
      for(const prd in products[pType].subtypes) {
        if (!products[pType].subtypes[prd].disabled) {
          ret.push({ ...products[pType].subtypes[prd], name: prd })
        }
      }
      return ret
    }
  }
}

export function findProductCategory(product) {
  if (product === 'generic_dev') {
    return 'Development'
  }
  if (product === 'generic_design') {
    return 'Design'
  }
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      const subType = products[pType].subtypes[prd]
      if (subType.id === product && !subType.disabled) {
        return pType
      }
    }
  }
}

/**
 * Finds field from the project creation template
 *
 * @param {string} product      id of the product. It should resolve to a template where search is to be made.
 * @param {string} sectionId    id of the section in the product template
 * @param {string} subSectionId id of the sub section under the section identified by sectionId
 * @param {string} fieldName    name of the field to be fetched
 *
 * @return {object} field from the template, if found, null otherwise
 */
export function getProjectCreationTemplateField(product, sectionId, subSectionId, fieldName) {
  let specification = 'topcoder.v1'
  if (product)
    specification = typeToSpecification[product]
  const sections = require(`../projectQuestions/${specification}`).basicSections
  const section = _.find(sections, {id: sectionId})
  let subSection = null
  if (subSectionId && section) {
    subSection = _.find(section.subSections, {id : subSectionId })
  }
  if (subSection) {
    if (subSectionId === 'questions') {
      return _.find(subSection.questions, { fieldName })
    }
    return subSection.fieldName === fieldName ? subSection : null
  }
  return null
}
