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
import FormsContainer from './containers/FormsContainer'
import FormDetails from './containers/FormDetails'
import PlanConfigsContainer from './containers/PlanConfigsContainer'
import PlanConfigDetails from './containers/PlanConfigDetails'
import PriceConfigsContainer from './containers/PriceConfigsContainer'
import PriceConfigDetails from './containers/PriceConfigDetails'
import MilestoneTemplatesContainer from './containers/MilestoneTemplatesContainer'
import MilestoneTemplateDetails from './containers/MilestoneTemplateDetails'
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
    <Route exact path="/metadata/milestoneTemplates" component={MilestoneTemplatesContainer} />
    <Route path="/metadata/new-milestone-template" render={MilestoneTemplateDetails} />
    <Route path="/metadata/milestoneTemplates/:id" render={MilestoneTemplateDetails} />
    <Route exact path="/metadata/forms" component={FormsContainer} />
    <Route path="/metadata/new-form" render={FormDetails} />
    <Route path="/metadata/forms/:key/versions/:version" render={FormDetails} />
    <Route exact path="/metadata/planConfigs" component={PlanConfigsContainer} />
    <Route path="/metadata/new-plan-config" render={PlanConfigDetails} />
    <Route path="/metadata/planConfigs/:key/versions/:version" render={PlanConfigDetails} />
    <Route exact path="/metadata/priceConfigs" component={PriceConfigsContainer} />
    <Route path="/metadata/new-price-config" render={PriceConfigDetails} />
    <Route path="/metadata/priceConfigs/:key/versions/:version" render={PriceConfigDetails} />
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
