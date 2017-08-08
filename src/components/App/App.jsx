import React from 'react'
import Layout from '../Layout/Layout'

require('./App.scss')

const App = (props) => {
  return (
    <Layout {...props}>
      { props.children }
    </Layout>
  )
}

export default App
