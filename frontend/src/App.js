import { Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import LoginFormPage from './components/LoginFormPage'
import { restoreUser } from './store/session'

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
    )
  );
}

export default App;
