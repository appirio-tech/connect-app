import React from 'react' // eslint-disable-line no-unused-vars
import { findTitle, isFileRequired, findFilesSectionTitle } from '../projectWizard'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    description: 'Please answer a few basic questions about your project and, as an option,\
                  add links to supporting documents in the “Notes” section.\
                  \
                  *AssureNXT - Rapid Test Design Module is a Component of AssureNXT which is a Test Management Platform.\
                  It helps in Automated Test Case and Test Data Model generation through business process diagrams.\
                  RTD establishes direct relationship between business requirements, process flows and test coverage.\
                  Accelerated Test Case generation for changed business process.\
                  \
                  *Tosca - Tricentis Tosca is a testing tool that is used to automate end-to-end testing for software applications.\
                  Tricentis Tosca combines multiple aspects of software testing (test case design, test automation, test data design \
                  and generation, and analytics) to test GUIs and APIs from a business perspective',
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
            description: 'Brief description of your project, salesforce implementation testing objectives',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please provide the required options',
            title: 'The salesforce accelerator pack comprises of pre-built test assets and tools/licenses support to enable customization services.\
                    Would you like to purchase all the components of the accelerator pack or only a subset of it? (choose all that apply)',
            description: 'Full solution will have all the above components, while Partial solution - \
                    can have just either the sfdc assets mentioned in option 1 OR SFDC assets + customized service without the license',
            fieldName: 'details.appDefinition.components',
            type: 'checkbox-group',
            options: [
              {value: 'pack_one', label: 'Manual Test packs + Business Models + Automation scripts'},
              {value: 'pack_two', label: 'License for AssureNXT and Tosca for 2 months'},
              {value: 'pack_three', label: 'Customization services to fit the pre-built assets to your specific use cases'}
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
            title: 'Are you using the Lightning Experience?',
            description: '',
            fieldName: 'details.appDefinition.lightningExperience.value',
            type: 'radio-group',
            options: [
              {value: 'Yes', label: 'Yes'},
              {value: 'No', label: 'No'},
              {value: 'Neither', label: 'I Don\'t Know'}
            ]
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information such as any existing test automation tool used,\
                      known constraints for automation, % of customizations in your salesforce implementation, etc.',
        type: 'notes'
      },
      {
        id: 'files',
        required: isFileRequired,
        title: findFilesSectionTitle,
        description: '',
        type: 'files',
        fieldName: 'attachments'
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
    description: 'Please answer a few basic questions about your project and, as an option,\
                  add links to supporting documents in the “Notes” section. If you have any \
                  files to upload, you’ll be able to do so later.\
                  \
                  *AssureNXT - Rapid Test Design Module is a Component of AssureNXT which is a Test Management Platform.\
                  It helps in Automated Test Case and Test Data Model generation through business process diagrams.\
                  RTD establishes direct relationship between business requirements, process flows and test coverage.\
                  Accelerated Test Case generation for changed business process.\
                  \
                  *Tosca - Tricentis Tosca is a testing tool that is used to automate end-to-end testing for software applications.\
                  Tricentis Tosca combines multiple aspects of software testing (test case design, test automation, test data design \
                  and generation, and analytics) to test GUIs and APIs from a business perspective',
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
            description: 'Brief description of your project, salesforce implementation testing objectives',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please provide the required options',
            title: 'The salesforce accelerator pack comprises of pre-built test assets and tools/licenses support to enable customization services.\
                    Would you like to purchase all the components of the accelerator pack or only a subset of it? (choose all that apply)',
            description: 'Full solution will have all the above components, while Partial solution - \
                    can have just either the sfdc assets mentioned in option 1 OR SFDC assets + customized service without the license',
            fieldName: 'details.appDefinition.components',
            type: 'checkbox-group',
            options: [
              {value: 'pack_one', label: 'Manual Test packs + Business Models + Automation scripts'},
              {value: 'pack_two', label: 'License for AssureNXT and Tosca for 2 months'},
              {value: 'pack_three', label: 'Customization services to fit the pre-built assets to your specific use cases'}
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
            title: 'Are you using the Lightning Experience?',
            description: '',
            fieldName: 'details.appDefinition.lightningExperience.value',
            type: 'radio-group',
            options: [
              {value: 'Yes', label: 'Yes'},
              {value: 'No', label: 'No'},
              {value: 'Neither', label: 'I Don\'t Know'}
            ]
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information such as any existing test automation tool used,\
                      known constraints for automation, % of customizations in your salesforce implementation, etc.',
        type: 'notes'
      }
    ]
  }
]