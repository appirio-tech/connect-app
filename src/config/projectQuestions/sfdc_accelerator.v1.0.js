import React from 'react' // eslint-disable-line no-unused-vars
import { findTitle } from '../projectWizard'
import IconTechOutlineMobile from  '../../assets/icons/icon-tech-outline-mobile.svg'
import IconTechOutlineTablet from  '../../assets/icons/icon-tech-outline-tablet.svg'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    description: 'Please answer a few basic questions about your project and, as an option, add links to supporting documents in the “Notes” section. If you have any files to upload, you’ll be able to do so later. *AssureNXT  - Rapid Test Design Module is a Component of AssureNXT which is a Test Management Platform. It helps in Automated Test Case and Test Data Model generation through business process diagrams. RTD establishes direct relationship between business requirements, process flows and test coverage. Accelerated Test Case generation for changed business process',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name to your project',
        fieldName: 'name',
        description: '',
        title: 'Project Name',
        type: 'project-name'
      },
      {
        id: 'questions',
        required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Need Descrition Content',
            title: 'Would you like to purchase all the components of the accelerator pack or only a subset of it? (choose all that apply)',
            description: 'The salesforce accelerator pack comprises of pre-built test assets and tools/licenses support to enable customization services.',
            fieldName: 'details.appDefinition.solution.value',
            type: 'tiled-radio-group',
            options: [
              {value: 'phone', title: 'Full Solution', icon: IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'Description about full solution'},
              {value: 'tablet', title: 'Partial Solution', icon: IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'Description about partial solution'}
            ]
          },
          {
            icon: 'question',
            title: 'Select the functionalities which are applicable for your salesforce Implementation ( 1 or multiple from the 10 listed below)',
            description: '',
            type: 'checkbox-group',
            fieldName: 'details.appDefinition.functionalities',
            options: [
              {value: 'sales_cloud_campaign', label: 'Sales Cloud - Campaign'},
              {value: 'lead', label: 'Lead'},
              {value: 'account', label: 'Account'},
              {value: 'contact', label: 'Contact'},
              {value: 'opportunity', label: 'Opportunity'},
              {value: 'quote', label: 'Quote'},
              {value: 'contract_and_order', label: 'Contract & Order Management'},
              {value: 'product_price', label: 'Product & Price Book and End to End Processes & Misc Functions (Activites Chatter Reports & Dashboards)'},
              {value: 'service_cloud_case_management', label: 'Service Cloud – Case Management'}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Need Descrition Content',
            title: 'Are you using the Lightning Experience? (YES/NO/I DO NOT KNOW)',
            description: 'Need Description Content',
            type: 'textbox',
            fieldName: 'details.appDefinition.lightningExperience.value'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information like requirements,\
                       architecture details, tools, performance baseline, etc.\
                       After creating your project you will be able to upload files.',
        type: 'notes'
      }
    ]
  }
]

export default sections

// This is where the project creation form lives

export const basicSections = [
  {
    id: 'appDefinition',
    title: '',
    required: true,
    description: 'Please answer a few basic questions about your project and, as an option, add links to supporting documents in the “Notes” section. If you have any files to upload, you’ll be able to do so later. *AssureNXT  - Rapid Test Design Module is a Component of AssureNXT which is a Test Management Platform. It helps in Automated Test Case and Test Data Model generation through business process diagrams. RTD establishes direct relationship between business requirements, process flows and test coverage. Accelerated Test Case generation for changed business process',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name to your project',
        fieldName: 'name',
        description: '',
        title: 'Project Name',
        type: 'project-name'
      },
      {
        id: 'questions',
        required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Need Descrition Content',
            title: 'Would you like to purchase all the components of the accelerator pack or only a subset of it? (choose all that apply)',
            description: 'The salesforce accelerator pack comprises of pre-built test assets and tools/licenses support to enable customization services.',
            fieldName: 'details.appDefinition.solution.value',
            type: 'tiled-radio-group',
            options: [
              {value: 'phone', title: 'Full Solution', icon: IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'Description about full solution'},
              {value: 'tablet', title: 'Partial Solution', icon: IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'Description about partial solution'}
            ]
          },
          {
            icon: 'question',
            title: 'Select the functionalities which are applicable for your salesforce Implementation ( 1 or multiple from the 10 listed below)',
            description: '',
            type: 'checkbox-group',
            fieldName: 'details.appDefinition.functionalities',
            options: [
              {value: 'sales_cloud_campaign', label: 'Sales Cloud - Campaign'},
              {value: 'lead', label: 'Lead'},
              {value: 'account', label: 'Account'},
              {value: 'contact', label: 'Contact'},
              {value: 'opportunity', label: 'Opportunity'},
              {value: 'quote', label: 'Quote'},
              {value: 'contract_and_order', label: 'Contract & Order Management'},
              {value: 'product_price', label: 'Product & Price Book and End to End Processes & Misc Functions (Activites Chatter Reports & Dashboards)'},
              {value: 'service_cloud_case_management', label: 'Service Cloud – Case Management'}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Need Descrition Content',
            title: 'Are you using the Lightning Experience? (YES/NO/I DO NOT KNOW)',
            description: 'Need Description Content',
            type: 'textbox',
            fieldName: 'details.appDefinition.lightningExperience.value'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information like requirements,\
                       architecture details, tools, performance baseline, etc.\
                       After creating your project you will be able to upload files.',
        type: 'notes'
      }
    ]
  }
]