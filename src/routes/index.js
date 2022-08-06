import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import NavbarApp from '../components/navbar';
import Login from '../views/login';
import Home from '../views/home';
import Favorites from '../views/favorites';

export default function Routes() {
  const DefaultContainer = () => (
    <>
      <NavbarApp />
      <Route path='/home' exact component={Home} />
      <Route path='/favorites' exact component={Favorites} />
    </>
  );

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  );
}
