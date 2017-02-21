import Icons from '../../components/Icons'

export default {
  Design: {
    icon: Icons.ProjectDesign,
    info: 'Create wireframes, mockups, graphic & visual design',
    question: 'What kind of design do you need?',
    subtypes: {
      Wireframes: {
        brief: '5-15 screens',
        details: `Translate your mobile or web app idea into a low-fidelity
          mockup that helps you visualize the navigation, content relationships,
          workflow, and structure of your application.`,
        icon: Icons.ProjectWireframes,
        id: 'generic'
      },
      'App Visual Design - Concepts': {
        brief: '1-10 screens',
        details: `Turn your app requirements into beautiful design concepts that
          let you visualize user experience and test interaction models.`,
        icon: Icons.ProjectAppVisualDesign,
        id: 'visual_design'
      },
      'App Visual Design - Production': {
        brief: '1-10 screens',
        details: `Translate your design requirements (wireframes and concepts)
          into a production-ready design resources that your developers can
          assemble into a stunning app.`,
        icon: Icons.ProjectAppVisualDesign,
        id: 'visual_design'
      }
    }
  }, 
  Prototype: {
    icon: Icons.ProjectPrototype,
    info: 'Visual click-through or technical app prototype',
    question: 'What prototype do you need?',
    subtypes: {
      Demo: {
        brief: '3-20 screens',
        details: `Quickly explore the most important user flows with a series of
          high-fidelity screens that behafe the way your final app would do,
          without the hassle of coding.`,
        icon: Icons.ProjectPrototypeDemo,
        id: 'visual_prototype'
      },
      Technical: {
        brief: '1-3 service(s)',
        details: 'Create a technical prototype.',
        icon: Icons.ProjectPrototypeTechnical,
        id: 'visual_prototype'
      }
    }
  }, 
  Development: {
    icon: Icons.ProjectDevelopment,
    info: 'Integration, API, Architecture POC, Bug Fixes, Components, Services',
    question: 'What do you need to develop?',
    subtypes: {
      Code: {
        brief: 'Hardcore development',
        details: `The difficult we do immediately, the impossible takes a little
          longer`,
        icon: Icons.ProjectDevelopmentCode,
        id: 'app_dev'
      },
      Ideation: {
        brief: 'Cloud castles',
        details: 'Let\'s dream about your success together',
        icon: Icons.ProjectDevelopmentIdeation,
        id: 'generic'
      }
    }
  }
}
