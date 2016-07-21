import { combineReducers } from 'redux'
import projectSearch from './projectSearch'
import projectSearchSuggestions from './projectSearchSuggestions'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import currentProject from '../projects/reducers/project'
import navSearch from './navSearch'

export default combineReducers({
  loadUser,
  navSearch,
  projectSearch,
  projectSearchSuggestions,
  // loadProject,
  currentProject,
  searchTerm
})
