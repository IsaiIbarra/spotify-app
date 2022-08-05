import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import NavbarApp from '../components/navbar';
import Home from '../views/Home';
import Login from '../views/Login';

export default function Routes() {
  const DefaultContainer = () => (
    <>
      <NavbarApp />
      <Route path='/home' exact component={Home} />
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
