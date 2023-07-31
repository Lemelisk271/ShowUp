import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchEvents } from '../../store/events'
import './EventList.css'

import EventListItem from '../EventListItem'

const EventsList = () => {
  const dispatch = useDispatch()
  const [eventList, setEventList] = useState([])
  const [rawEventData, setRawEventData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const events = useSelector(state => state.events.allEvents)

  useEffect(() => {
    const getEvents = async () => {
      await dispatch(fetchEvents())
      setIsLoaded(true)
    }
    getEvents()
  }, [dispatch])

  useEffect(() => {
    if (isLoaded) {
      setRawEventData(Object.values(events))
    }
  }, [isLoaded, events])

  useEffect(() => {
    if (isLoaded && rawEventData.length > 0) {
      const eventArray = []
      rawEventData.forEach(event => {
        const start = new Date(event.startDate)
        const today = Date.now()
        const startTime = start.getTime()
        if (startTime >= today) {
          eventArray.push(event)
        }
      })
      setEventList(eventArray)
    }
  }, [rawEventData, isLoaded])

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
