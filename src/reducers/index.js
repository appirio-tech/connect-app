import { combineReducers } from 'redux'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import { projectState } from '../projects/reducers/project'
import { projectDashboard } from '../projects/reducers/projectDashboard'
import { projectTopics } from '../projects/reducers/projectTopics'
import navSearch from './navSearch'
import projectSearch from '../projects/reducers/projectSearch'
import projectSearchSuggestions from '../projects/reducers/projectSearchSuggestions'
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
  projectTopics,
  alerts
})
