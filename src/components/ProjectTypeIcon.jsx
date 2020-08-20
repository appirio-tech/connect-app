/**
 * ProjectTypeIcon component
 *
 * Renders proper project type icon depend on the project type
 */
import React from 'react'
import PT from 'prop-types'

import IconAccessibilityCompliance from '../assets/icons/v.2.5/project-types/accessibility-compliance.svg'
import IconApplicationsWebsites from '../assets/icons/v.2.5/project-types/applications-websites.svg'
import IconBetaTesting from '../assets/icons/v.2.5/project-types/beta-testing.svg'
import IconBuyCapacity from '../assets/icons/v.2.5/project-types/buy-capacity.svg'
import IconChatbot from '../assets/icons/v.2.5/project-types/chatbot.svg'
import IconCompatibilityTesting from '../assets/icons/v.2.5/project-types/compatibility-testing.svg'
import IconComputerVision from '../assets/icons/v.2.5/project-types/computer-vision.svg'
import IconDataScienceIdeation from '../assets/icons/v.2.5/project-types/data-science-ideation.svg'
import IconDataScienceSprint from '../assets/icons/v.2.5/project-types/data-science-sprint.svg'
import IconDataVisualization from '../assets/icons/v.2.5/project-types/data-visualization.svg'
import IconEngageTalent from '../assets/icons/v.2.5/project-types/engage-talent.svg'
import IconExploratoryTesting from '../assets/icons/v.2.5/project-types/exploratory-testing.svg'
import IconFunctionalFeatureTesting from '../assets/icons/v.2.5/project-types/functional-feature-testing.svg'
import IconLocalizationTesting from '../assets/icons/v.2.5/project-types/localization-testing.svg'
import IconMobileAppCertification from '../assets/icons/v.2.5/project-types/mobile-app-certification.svg'
import IconOnDemand from '../assets/icons/v.2.5/project-types/on-demand.svg'
import IconPerformanceImprovement from '../assets/icons/v.2.5/project-types/performance-improvement.svg'
import IconRegressionAutomation from '../assets/icons/v.2.5/project-types/regression-automation.svg'
import IconRegressionTesting from '../assets/icons/v.2.5/project-types/regression-testing.svg'
import IconSalesforceImplementation from '../assets/icons/v.2.5/project-types/salesforce-implementation.svg'
import IconSolutions from '../assets/icons/v.2.5/project-types/solutions.svg'
import IconUserSentimentAnalysis from '../assets/icons/v.2.5/project-types/user-sentiment-analysis.svg'
import IconDefault from '../assets/icons/v.2.5/project-types/default.svg'
import IconTcInternal from '../assets/icons/ui-rocket-white.svg'

const ProjectTypeIcon = ({ type }) => {
  // if type is defined as a relative path to the icon, convert it to icon "id"
  const typeAsPath = type && type.match(/(?:\.\.\/)+assets\/icons\/([^.]+)\.svg/)
  if (typeAsPath) {
    type = typeAsPath[1]
  }

  switch(type) {
  case 'accessibility-compliance': return <IconAccessibilityCompliance />
  case 'applications-websites': return <IconApplicationsWebsites />
  case 'beta-testing': return <IconBetaTesting />
  case 'buy-capacity': return <IconBuyCapacity />
  case 'chatbot': return <IconChatbot />
  case 'compatibility-testing': return <IconCompatibilityTesting />
  case 'computer-vision': return <IconComputerVision />
  case 'data-science-ideation': return <IconDataScienceIdeation />
  case 'data-science-sprint': return <IconDataScienceSprint />
  case 'data-visualization': return <IconDataVisualization />
  case 'engage-talent': return <IconEngageTalent />
  case 'exploratory-testing': return <IconExploratoryTesting />
  case 'functional-feature-testing': return <IconFunctionalFeatureTesting />
  case 'localization-testing': return <IconLocalizationTesting />
  case 'mobile-app-certification': return <IconMobileAppCertification />
  case 'on-demand': return <IconOnDemand />
  case 'performance-improvement': return <IconPerformanceImprovement />
  case 'regression-automation': return <IconRegressionAutomation />
  case 'regression-testing': return <IconRegressionTesting />
  case 'salesforce-implementation': return <IconSalesforceImplementation />
  case 'solutions': return <IconSolutions />
  case 'user-sentiment-analysis': return <IconUserSentimentAnalysis />
  case 'tc-internal': return <IconTcInternal />
  default:
    // this will be default icon
    return <IconDefault />
  }
}

ProjectTypeIcon.propTypes = {
  type: PT.string,
}

export default ProjectTypeIcon
