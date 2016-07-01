import React from 'react'
import Layout from '../Layout/Layout'
import { DOMAIN } from '../../config/constants'

require('./App.scss')

const App = ({ children }) => {
  return (
    <Layout>
      { children }
    </Layout>
  )
}

export default App
