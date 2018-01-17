import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ProjectListTimeSortColHeader from './ProjectListTimeSortColHeader'
// import ProjectSegmentSelect from './ProjectSegmentSelect'
import GridView from '../../../../components/Grid/GridView'
import UserTooltip from '../../../../components/User/UserTooltip'
import { PROJECTS_LIST_PER_PAGE, SORT_OPTIONS } from '../../../../config/constants'
import { findProduct } from '../../../../config/projectWizard'
import TextTruncate from 'react-text-truncate'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
import ProjectManagerAvatars from './ProjectManagerAvatars'
import ProjectStatusTitle from '../../../../assets/icons/status-ico.svg'
import IconAnalyticsAlgorithmOptimization from '../../../../assets/icons/product-analytics-algorithm-optimization.svg'
import IconAnalyticsComputerVision from '../../../../assets/icons/product-analytics-computer-vision.svg'
import IconAnalyticsDataExploration from '../../../../assets/icons/product-analytics-data-exploration.svg'
import IconAnalyticsPredictiveAnalytics from '../../../../assets/icons/product-analytics-predictive-analytics.svg'
import IconAppApp from '../../../../assets/icons/product-app-app.svg'
import IconCatAnalytics from '../../../../assets/icons/product-cat-analytics.svg'
import IconCatApp from '../../../../assets/icons/product-cat-app.svg'
import IconCatChatbot from '../../../../assets/icons/product-cat-chatbot.svg'
import IconCatDesign from '../../../../assets/icons/product-cat-design.svg'
import IconCatDevelopment from '../../../../assets/icons/product-cat-development.svg'
import IconCatQa from '../../../../assets/icons/product-cat-qa.svg'
import IconCatWebsite from '../../../../assets/icons/product-cat-website.svg'
import IconChatbotChatbot from '../../../../assets/icons/product-chatbot-chatbot.svg'
import IconChatbotWatson from '../../../../assets/icons/product-chatbot-watson.svg'
import IconDesignAppVisual from '../../../../assets/icons/product-design-app-visual.svg'
import IconDesignInfographic from '../../../../assets/icons/product-design-infographic.svg'
import IconDesignOther from '../../../../assets/icons/product-design-other.svg'
import IconDesignWireframes from '../../../../assets/icons/product-design-wireframes.svg'
import IconDevFrontendDev from '../../../../assets/icons/product-dev-front-end-dev.svg'
import IconDevIntegration from '../../../../assets/icons/product-dev-integration.svg'
import IconDevOther from '../../../../assets/icons/product-dev-other.svg'
import IconDevPrototype from '../../../../assets/icons/product-dev-prototype.svg'
import IconOtherDesign from '../../../../assets/icons/product-other-design.svg'
import IconQaConsulting from '../../../../assets/icons/product-qa-consulting.svg'
import IconQaCrowdTesting from '../../../../assets/icons/product-qa-crowd-testing.svg'
import IconQaDigitalAccessability from '../../../../assets/icons/product-qa-digital-accessability.svg'
import IconQaHelthCheck from '../../../../assets/icons/product-qa-health-check.svg'
import IconQaMobilityTesting from '../../../../assets/icons/product-qa-mobility-testing.svg'
import IconQaOsAutomation from '../../../../assets/icons/product-qa-os-automation.svg'
import IconQaWebsitePrerfomance from '../../../../assets/icons/product-qa-website-performance.svg'
import IconWebsiteWebsite from '../../../../assets/icons/product-website-website.svg'
import IconOutlineWorkProject from '../../../../assets/icons/tech-32px-outline-work-project.svg'
require('./ProjectsGridView.scss')

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

/**
 * @params {string} class name
 */
const IconProjectStatusTitle = ({ className }) => {
  return <ProjectStatusTitle className={className}/>
}

IconProjectStatusTitle.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const ProjectTypeIcons = ({ type }) => {
  switch(type){
  case 'product-analytics-algorithm-optimization':
    return <IconAnalyticsAlgorithmOptimization className="icon-analytics-algorithm-optimization"/>
  case 'product-analytics-computer-vision':
    return <IconAnalyticsComputerVision className="icon-analytics-computer-vision"/>
  case 'product-analytics-data-exploration':
    return <IconAnalyticsDataExploration className="icon-analytics-data-exploration"/>
  case 'product-analytics-predictive-analytics':
    return <IconAnalyticsPredictiveAnalytics className="icon-analytics-predictive-analytics"/>
  case 'product-app-app':
    return <IconAppApp className="icon-app-app"/>
  case 'product-cat-analytics':
    return <IconCatAnalytics className="icon-cat-analytics"/>
  case 'product-cat-app':
    return <IconCatApp className="icon-cat-app"/>
  case 'product-cat-chatbot':
    return <IconCatChatbot className="icon-cat-chatbot"/>
  case 'product-cat-design':
    return <IconCatDesign className="icon-cat-design"/>
  case 'product-cat-development':
    return <IconCatDevelopment className="icon-cat-development"/>
  case 'product-cat-qa':
    return <IconCatQa className="icon-cat-qa"/>
  case 'product-cat-website':
    return <IconCatWebsite className="icon-cat-website"/>
  case 'product-chatbot-chatbot':
    return <IconChatbotChatbot className="icon-chatbot-chatbot"/>
  case 'product-chatbot-watson':
    return <IconChatbotWatson className="icon-chatbot-watson"/>
  case 'product-design-app-visual':
    return <IconDesignAppVisual className="icon-design-app-visual"/>
  case 'product-design-infographic':
    return <IconDesignInfographic className="icon-design-infographic"/>
  case 'product-design-other':
    return <IconDesignOther className="icon-design-other"/>
  case 'product-design-wireframes':
    return <IconDesignWireframes className="icon-design-wireframes"/>
  case 'product-dev-front-end-dev':
    return <IconDevFrontendDev className="icon-dev-frontend-dev"/>
  case 'product-dev-integration':
    return <IconDevIntegration className="icon-dev-integration"/>
  case 'product-dev-other':
    return <IconDevOther className="icon-dev-other"/>
  case 'product-dev-prototype':
    return <IconDevPrototype className="icon-dev-prototype"/>
  case 'product-other-design':
    return <IconOtherDesign  className="icon-dev-other"/>
  case 'product-qa-consulting':
    return <IconQaConsulting className="icon-qa-consulting"/>
  case 'product-qa-crowd-testing':
    return <IconQaCrowdTesting className="icon-qa-crowd-testing"/>
  case 'product-qa-digital-accessability':
    return <IconQaDigitalAccessability className="icon-qa-digital-accessability"/>
  case 'product-qa-health-check':
    return <IconQaHelthCheck className="icon-qa-health-check"/>
  case 'product-qa-mobility-testing':
    return <IconQaMobilityTesting className="icon-qa-mobility-testing"/>
  case 'product-qa-os-automation':
    return <IconQaOsAutomation className="icon-qa-os-automation"/>
  case 'product-qa-website-performance':
    return <IconQaWebsitePrerfomance className="icon-qa-website-performance"/>
  case 'product-website-website':
    return <IconWebsiteWebsite className="icon-website-website"/>
  case 'tech-32px-outline-work-project':
    return <IconOutlineWorkProject className="icon-outline-work-project" />
  default:
    return 'undefined icon'
  }
}

ProjectTypeIcons.propTypes = {
  className: PropTypes.string
}


const ProjectsGridView = props => {
  const { projects, members, totalCount, criteria, pageNum, sortHandler, onPageChange,
    error, isLoading, infiniteAutoload, setInfiniteAutoload, projectsStatus, onChangeStatus } = props

  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'id',
      headerLabel: 'ID',
      classes: 'item-id',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <Link to={url} className="spacing">
            { recentlyCreated  && <span className="blue-border" /> }
            { item.id.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) }
          </Link>
        )
      }
    }, {
      id: 'icon',
      headerLabel: '',
      classes: 'item-icon',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const productType = _.get(item, 'details.products[0]')
        const product = findProduct(productType)
        // icon for the product, use default generic work project icon for categories which no longer exist now
        const productIcon = _.get(product, 'icon', 'tech-32px-outline-work-project')
        return (
          <Link to={url} className="spacing">
            <div className="project-type-icon" title={item.type !== undefined ? item.type[0].toUpperCase() + item.type.substr(1).replace(/_/g, ' ') : null}>
              <ProjectTypeIcons type={productIcon} />
            </div>
          </Link>
        )
      }
    }, {
      id: 'projects',
      headerLabel: 'Project',
      classes: 'item-projects',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const code = _.get(item, 'details.utm.code', '')
        return (
          <div className="spacing project-container">
            <div className="project-title">
              <Link to={url} className="link-title">{item.name}</Link>
              { code && <span className="item-ref-code txt-gray-md">{code}</span> }
            </div>
            <Link to={url}>
              <TextTruncate
                containerClassName="project-description"
                line={2}
                truncateText="..."
                text={ item.description }
              />
            </Link>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: <ProjectListTimeSortColHeader currentSortField={currentSortField} sortHandler={sortHandler}/>,
      sortable: false,
      classes: 'item-status-date',
      renderText: item => {
        const sortMetric = _.find(SORT_OPTIONS, o => currentSortField === o.val) || SORT_OPTIONS[0]
        const lastAction = item[sortMetric.field] === 'createdAt' ? 'createdBy' : 'updatedBy'
        const lastEditor = members[item[lastAction]]
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{moment(item[sortMetric.field]).format('MMM D, h:mm a')}</div>
            <div className="project-last-editor">
              {
                lastEditor ? `${lastEditor.firstName} ${lastEditor.lastName}` : 'Unknown'
              }
            </div>
          </div>
        )
      }
    }, {
      id: 'customer',
      headerLabel: 'Customer',
      sortable: false,
      classes: 'item-customer',
      renderText: item => {
        const m = _.find(item.members, m => m.isPrimary && m.role === 'customer')
        if (!m)
          return <div className="user-block txt-italic">Unknown</div>
        return (
          <div className="spacing">
            <div className="user-block">
              <UserTooltip usr={m} id={item.id}/>

            </div>
          </div>
        )
        // TODO: Restore user segment when we support it
        // <div className="project-segment">
        //  <ProjectSegmentSelect currentSegment={item.segment || 'self-service'}/>
        // </div>
        // Hiding the user segment for the momemnt
      }
    }, {
      id: 'managers',
      headerLabel: 'Managers',
      sortable: false,
      classes: 'item-manager',
      renderText: item => {
        const m = _.filter(item.members, m => m.role === 'manager')
        return (
          <div className="spacing">
            <ProjectManagerAvatars managers={m}/>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: <IconProjectStatusTitle className="project-status-title" />,
      sortable: false,
      classes: 'item-status',
      renderText: item => {
        return (
          <div className="spacing">
            <EnhancedProjectStatus
              status={item.status}
              showText={false}
              withoutLabel
              canEdit
              unifiedHeader={false}
              onChangeStatus={onChangeStatus}
              projectId={item.id}
            />
          </div>
        )
      }
    }
  ]

  // annotate projects with member data
  _.forEach(projects, prj => {
    prj.members = _.map(prj.members, m => {
      // there is some bad data in the system
      if (!m.userId) return m
      return _.assign({}, m, {
        photoURL: ''
      },
      members[m.userId.toString()])
    })
  })

  const gridProps = {
    error,
    isLoading,
    columns,
    onPageChange,
    sortHandler,
    currentSortField,
    resultSet: projects,
    totalCount,
    currentPageNum: pageNum,
    pageSize: PROJECTS_LIST_PER_PAGE,
    infiniteAutoload,
    infiniteScroll: true,
    setInfiniteAutoload,
    projectsStatus
  }

  return (
    <div>
      <GridView {...gridProps} />
    </div>
  )
}


ProjectsGridView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired
}

export default ProjectsGridView
