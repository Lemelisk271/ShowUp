import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchEvents } from '../../store/events'

import EventListItem from '../EventListItem'

const EventsList = () => {
  const dispatch = useDispatch()
  const events = useSelector(state => state.events.allEvents)
  const [eventList, setEventList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getEvents = async () => {
      await dispatch(fetchEvents())
      setIsLoaded(true)
    }
    getEvents()
  }, [dispatch])

  useEffect(() => {
    if (isLoaded) {
      setEventList(Object.values(events))
    }
  }, [isLoaded, events])

  console.log(eventList)

  return (
    <div className='eventList'>
      <div className='eventList-header'>
        <div className='eventList-links'>
          <p>Events</p>
          <Link to='/groups'>Groups</Link>
        </div>
        <p>Events in Showup</p>
      </div>
      <div className='eventList-main'>
        {isLoaded ? (
          eventList.map(event => (
            <EventListItem key={event.id} event={event} />
          ))
        ):(
          <h1>Loading</h1>
        )}
      </div>
    </div>
  )
}

export default EventsList
