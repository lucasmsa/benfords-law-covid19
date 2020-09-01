import React from 'react';
import GlobalStyle from './styles/global'
import Routes from './routes'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes />
      <GlobalStyle />
    </Router>
  );
}

export default App;
