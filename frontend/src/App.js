import { Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreUser } from './store/session'

import LoginFormPage from './components/LoginFormPage'
import SignupFormPage from './components/SignupFormPage'
import Navigation from './components/Navigation'

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      await dispatch(restoreUser())
      setIsLoaded(true)
    }
    getUser()
  }, [dispatch])

  return (
    isLoaded && (
      <>
        <nav>
          <Navigation isLoaded={isLoaded}/>
        </nav>
        <main>
          <Switch>
            <Route exact path='/'>
              <h1>Home Page</h1>
            </Route>
            <Route path='/login'>
              <LoginFormPage />
            </Route>
            <Route path='/signup'>
              <SignupFormPage />
            </Route>
            <Route>
              <h1>Page Not Found</h1>
            </Route>
          </Switch>
        </main>
      </>
    )
  );
}

export default App;
