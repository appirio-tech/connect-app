import React, { PropTypes } from 'react'
import {Table, Column, Cell} from 'fixed-data-table';
import Project from '../Project/Project'

require('./ProjectList.scss')
require('fixed-data-table/dist/fixed-data-table.css')

const ProjectList = (({ projects }) => {


  const projectsDOM = <Table
    rowHeight={50}
    rowsCount={projects.length}
    width={900}
    height={600}
    headerHeight={50}>
    <Column
      header={<Cell>Name</Cell>}
      cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          { projects[rowIndex].name }
        </Cell>
      )}
      flexGrow={3}
      width={100}
    />
    <Column
      header={<Cell>Phase</Cell>}
      cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          { projects[rowIndex].currentPhase }
        </Cell>
      )}
      flexGrow={1}
      width={100}
    />
    <Column
      header={<Cell>Starts On</Cell>}
      cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          { projects[rowIndex].startsOn }
        </Cell>
      )}
      flexGrow={1}
      width={100}
    />
  </Table>


  return (
    <div className="project-list">
      { projectsDOM }
    </div>
  )
})

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProjectList
