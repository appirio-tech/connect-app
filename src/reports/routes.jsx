import React from 'react'
import { Route } from 'react-router'

import ReportDashboard from './components/dashboard/ReportDashboard'

const reportsListRoutes = (
  <Route path="/reports" component={ ReportDashboard } />
)

export default reportsListRoutes
