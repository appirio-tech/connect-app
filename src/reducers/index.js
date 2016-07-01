import { combineReducers } from 'redux'
import projectSearch from './projectSearch'
import searchTerm from './searchTerm'
import loadUser from './loadUser'
import navSearch from './navSearch'

export default combineReducers({
  loadUser,
  navSearch,
  projectSearch,
  searchTerm
})
