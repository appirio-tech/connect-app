const products = {
  Design: {
    icon: 'product-app-visual-design',
    info: 'Wireframe, mockups, visual design, and more',
    question: 'What kind of design do you need?',
    id: 'visual_design',
    subtypes: {
      Wireframes: {
        brief: '10-15 screens',
        details: 'Plan and explore the navigation and structure of your app',
        icon: 'project-wireframes',
        id: 'wireframes'
      },
      'Visual Design': {
        brief: '1-15 screens',
        details: 'Visualize and test your app requirements and ideas',
        icon: 'project-app-visual-design',
        id: 'visual_design_concepts'
      },
      'App Visual Design - Production': {
        brief: '1-15 screens',
        details: 'Create development-ready designs',
        icon: 'project-app-visual-design',
        id: 'visual_design_prod',
        disabled: true
      },
      'Infographic': {
        brief: 'Infographic',
        details: 'Present your data in a clean and a fun way',
        icon: 'project-app-visual-design',
        id: 'infographic'
      },
      'Other Design': {
        brief: 'other designs',
        details: 'Get help with other types of design',
        icon: 'project-wireframes',
        id: 'generic_design'
      }
    }
  },
  Development: {
    icon: 'product-code',
    info: 'Front end prototypes, website and application development, services, and more',
    question: 'What do you need to develop?',
    id: 'app_dev',
    subtypes: {
      'Front-end Prototype': {
        brief: '3-20 screens',
        details: 'Translate designs to an HTML/CSS/JavaScript prototype',
        icon: 'project-prototype-demo',
        id: 'visual_prototype'
      },
      'Website': {
        brief: 'Websites',
        details: 'Build responsive or regular websites',
        icon: 'project-prototype-technical',
        id: 'website_development'
      },
      'App': {
        brief: 'Apps',
        details: 'Build apps for mobile, web, or wearables',
        icon: 'project-development-code',
        id: 'application_development'
      },
      'Software Development': {
        brief: 'Tasks or adhoc',
        details: 'Get help with any part of your development cycle',
        icon: 'project-development-ideation',
        id: 'generic_dev'
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

export function findProductCategory(product) {
  if (product === 'generic_dev') {
    return 'Development'
  }
  if (product === 'generic_design') {
    return 'Design'
  }
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      if (products[pType].subtypes[prd].id === product) {
        return pType
      }
    }
  }
}
