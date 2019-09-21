/**
 * Portal subsection renders other sections
 *
 * Content is an array of objects:
 * ```
 * content=[{ "sectionIndex": 1 }, { "sectionIndex": 3 }]
 * ```
 * This means show section with index 1, and section with index 2
 *
 * Potentially we can extend this component to render subSections and questions.
 */
import React from 'react'

import SpecSection from './SpecSection'

const PortalSubSection = ({
  content,
  template,
  project,
  dirtyProject,
  currentWizardStep,
  productTemplates,
  productCategories,
  addAttachment,
  updateAttachment,
  removeAttachment,
  canManageAttachments,
  attachmentsStorePath,
  isCreation,
}) => (
  <div>
    {content.map(({ sectionIndex }) => {
      if (sectionIndex !== -1 && template && template.sections[sectionIndex]) {
        const section = template.sections[sectionIndex]

        if (
          // hide if section is hidden by condition
          _.get(section, '__wizard.hiddenByCondition') ||
          // hide section in edit mode, if it should be hidden on edit
          !isCreation && section.hiddenOnEdit
        ) {
          return null
        }

        return (
          <SpecSection
            key={'portal-' + (section.id || `section-${sectionIndex}`)}
            {...section}
            project={project}
            template={template}
            currentWizardStep={currentWizardStep}
            dirtyProject={dirtyProject}
            productTemplates={productTemplates}
            productCategories={productCategories}
            isProjectDirty
            sectionNumber={sectionIndex + 1}
            showFeaturesDialog={ () => {} }//dummy
            resetFeatures={ () => {} }//dummy
            validate={() => {}}//dummy
            isCreation
            addAttachment={addAttachment}
            updateAttachment={updateAttachment}
            removeAttachment={removeAttachment}
            attachmentsStorePath={attachmentsStorePath}
            canManageAttachments={canManageAttachments}
          />
        )
      } else {
        console.error('Section to render in portal cannot be found.')
      }

      return <noscript />
    })}
  </div>
)

export default PortalSubSection
