import { combineReducers } from 'redux'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import { projectState } from '../projects/reducers/project'
import { projectSpecification } from '../projects/reducers/projectSpecification'
import { projectDashboard } from '../projects/reducers/projectDashboard'
import { projectTopics } from '../projects/reducers/projectTopics'
import navSearch from './navSearch'
import projectSearch from '../projects/reducers/projectSearch'
import projectSearchSuggestions from '../projects/reducers/projectSearchSuggestions'
import members from './members'
import alerts from './alerts'
import notifications from '../routes/notifications/reducers'
import settings from '../routes/settings/reducers'

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
  alerts,
  notifications,
  settings,
  projectSpecification
})
