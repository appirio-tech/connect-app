import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import { Link } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import ProjectProgress from '../ProjectProgress/ProjectProgress'
import ProjectStatus from '../ProjectStatus/ProjectStatus'
import { findCategory } from '../../config/projectWizard'
import SVGIconImage from '../SVGIconImage'
import { PROJECT_STATUS_ACTIVE } from '../../config/constants'
import './ProjectSidebarInfo.scss'

function ProjectSidebarInfo({ project, duration, currentMemberRole}) {

    if (!project) return null

    const category = findCategory(project.type)
    // icon for the category, use default generic work project icon for categories which no longer exist now
    const categoryIcon = _.get(category, 'icon', 'tech-32px-outline-work-project')
    return (
        <div className="project-sidebar-info">
            <div className="header">
                <div className="project-header">
                    <div className="project-type-icon"><SVGIconImage filePath={categoryIcon} /></div>
                    <div className="project-details">
                        <div className="project-name">
                            <TextTruncate
                                containerClassName="project-name"
                                line={1}
                                truncateText="..."
                                text={project.name}
                            />
                        </div>
                        <div className="project-date">{moment(project.updatedAt).format('MMM DD, YYYY')}</div>
                    </div>
                </div>
            </div>
            <div className="body">
                <TextTruncate
                    containerClassName="project-description"
                    line={4}
                    truncateText="..."
                    text={project.description}
                    textTruncateChild={<span><Link className="read-more-link" to={`/projects/${project.id}/specification`}> read more </Link></span>}
                />
                <div className="project-status">
                    {project.status !== PROJECT_STATUS_ACTIVE &&
                        <ProjectStatus
                            status={project.status}
                            showText
                            withoutLabel
                            currentMemberRole={currentMemberRole}
                            canEdit={false}
                            unifiedHeader={false}
                        />
                    }
                    {project.status === PROJECT_STATUS_ACTIVE &&
                        <ProjectProgress {...duration} viewType={ProjectProgress.ViewTypes.CIRCLE} percent={46}>
                            <span className="progress-text">{duration.percent}% completed</span>
                        </ProjectProgress>
                    }
                </div>
            </div>
        </div>
    )
}

ProjectSidebarInfo.defaultTypes = {
}

ProjectSidebarInfo.propTypes = {
    project: PT.object.isRequired,
    currentMemberRole: PT.string,
    duration: PT.object.isRequired,
}

export default ProjectSidebarInfo
