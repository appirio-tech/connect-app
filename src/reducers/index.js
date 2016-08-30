import { combineReducers } from 'redux'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import { projectState } from '../projects/reducers/project'
import { projectDashboard } from '../projects/reducers/projectDashboard'
import navSearch from './navSearch'
import projectSearch from '../projects/list/reducers/projectSearch'
import projectSearchSuggestions from '../projects/list/reducers/projectSearchSuggestions'
import members from './members'
import alerts from './alerts'

export default combineReducers({
  loadUser,
  navSearch,
  searchTerm,
  projectSearch,
  projectSearchSuggestions,
  projectState,
  members,
  projectDashboard,
  alerts
})
