export default {
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
      'App Visual Design - Concepts': {
        brief: '1-15 screens',
        details: 'Visualize and test your app requirements and ideas',
        icon: 'project-app-visual-design',
        id: 'visual_design_concepts'
      },
      'App Visual Design - Production': {
        brief: '1-15 screens',
        details: 'Create development-ready designs',
        icon: 'project-app-visual-design',
        id: 'visual_design_prod'
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
      Prototype: {
        brief: '3-20 screens',
        details: 'Translate designs to an HTML/CSS/JavaScript prototype',
        icon: 'project-prototype-demo',
        id: 'visual_prototype'
      },
      'Website Development': {
        brief: 'Websites',
        details: 'Build responsive or regular websites',
        icon: 'project-prototype-technical',
        id: 'website_development'
      },
      'Application Development': {
        brief: 'Apps',
        details: 'Build apps for mobile, web, or wearables',
        icon: 'project-development-code',
        id: 'application_development'
      },
      'Other Development': {
        brief: 'Tasks or adhoc',
        details: 'Get help with any part of your development cycle',
        icon: 'project-development-ideation',
        id: 'generic_dev'
      }
    }
  }
}
