import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from './store'
import App from './App';

const store = configureStore()

if (process.env.NODE_ENV !== 'production') {
  window.store = store
}

function Root() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
