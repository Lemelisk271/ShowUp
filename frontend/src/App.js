import { Switch, Route } from 'react-router-dom'
import LoginFormPage from './components/LoginFormPage'

function App() {
  return (
    <main>
      <Switch>
        <Route exact path='/'>
          <h1>Home Page</h1>
        </Route>
        <Route path='/login'>
          <LoginFormPage />
        </Route>
        <Route>
          <h1>Page Not Found</h1>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
