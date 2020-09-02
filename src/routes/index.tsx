import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Graph from '../pages/Graph'

const Routes: React.FC = () => (
  <Switch>
    <Route path='/' exact component={Home} />
    <Route path='/data/brazil' exact component={Graph} />
    <Route path='/data/world' exact component={Graph} />
  </Switch>
)

export default Routes