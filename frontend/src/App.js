import { Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreUser } from './store/session'

import Navigation from './components/Navigation'
import Home from './components/Home'

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
              <Home />
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
