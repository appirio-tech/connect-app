/**
 * Metadata routes
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withProps } from 'recompose'
import { renderApp } from '../../components/App/App'
import CoderBot from '../../components/CoderBot/CoderBot'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import MetaDataToolBar from './components/MetaDataToolBar'
import MetaDataLayout from './components/MetaDataLayout'
import ProjectTemplatesContainer from './containers/ProjectTemplatesContainer'
import ProjectTemplateDetails from './containers/ProjectTemplateDetails'
import ProductTemplateDetails from './containers/ProductTemplateDetails'
import ProjectTypesContainer from './containers/ProjectTypesContainer'
import ProjectTypeDetails from './containers/ProjectTypeDetails'
import ProductTemplatesContainer from './containers/ProductTemplatesContainer'
import ProductCategoriesContainer from './containers/ProductCategoriesContainer'
import ProductCategoryDetails from './containers/ProductCategoryDetails'
import { requiresAuthentication } from '../../components/AuthenticatedComponent'

const MetaDataLayoutWithAuth = requiresAuthentication(MetaDataLayout)

const MetaDataContainerWithAuth = withProps({ main:
  <Switch>
    <Route exact path="/metadata/projectTemplates" component={ProjectTemplatesContainer} />
    <Route path="/metadata/new-project-template" render={ProjectTemplateDetails} />
    <Route path="/metadata/projectTemplates/:templateId" render={ProjectTemplateDetails} />
    <Route exact path="/metadata/productTemplates" component={ProductTemplatesContainer} />
    <Route path="/metadata/new-product-template" render={ProductTemplateDetails} />
    <Route path="/metadata/productTemplates/:templateId" render={ProductTemplateDetails} />
    <Route exact path="/metadata/projectTypes" component={ProjectTypesContainer} />
    <Route path="/metadata/new-project-type" render={ProjectTypeDetails} />
    <Route path="/metadata/projectTypes/:key" render={ProjectTypeDetails} />
    <Route exact path="/metadata/productCategories" component={ProductCategoriesContainer} />
    <Route path="/metadata/new-product-category" render={ProductCategoryDetails} />
    <Route path="/metadata/productCategories/:key" render={ProductCategoryDetails} />
    <Route render={() => <CoderBot code={404}/>} />
  </Switch>
})(MetaDataLayoutWithAuth)

export default (
  <Route
    path="/metadata"
    render={() => (
      <Switch>
        <Route path="/metadata" render={renderApp(<TopBarContainer toolbar={MetaDataToolBar} />, <MetaDataContainerWithAuth />)} />
      </Switch>
    )}
  />
)
