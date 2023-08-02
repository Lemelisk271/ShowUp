import { Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreUser } from './store/session'

import Navigation from './components/Navigation'
import Home from './components/Home'
import GroupsList from './components/GroupsList'
import EventsList from './components/EventsList'
import GroupsNew from './components/GroupsNew'
import GroupDetail from './components/GroupDetail'
import EventDetail from './components/EventDetail'
import EventsForm from './components/EventsForm'
import GroupsUpdate from './components/GroupsUpdate'

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
            <Route exact path='/groups'>
              <GroupsList />
            </Route>
            <Route exact path='/groups/new'>
              <GroupsNew />
            </Route>
            <Route exact path='/groups/:groupId'>
              <GroupDetail />
            </Route>
            <Route path='/groups/:groupId/edit'>
              <GroupsUpdate />
            </Route>
            <Route exact path='/events'>
              <EventsList />
            </Route>
            <Route exact path='/events/new'>
              <EventsForm />
            </Route>
            <Route path='/events/:eventId'>
              <EventDetail />
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
