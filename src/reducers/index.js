import { combineReducers } from 'redux'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import { projectState, newProject, newProjectForm } from '../projects/reducers/project'
import navSearch from './navSearch'
import projectSearch from '../projects/list/reducers/projectSearch'
import projectSearchSuggestions from '../projects/list/reducers/projectSearchSuggestions'
import loadProject from '../projects/list/reducers/loadProject'

export default combineReducers({
  loadUser,
  navSearch,
  searchTerm,
  projectSearch,
  projectSearchSuggestions,
  projectState,
  newProject, newProjectForm,
  loadProject // TODO rename this
})
