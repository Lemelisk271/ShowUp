import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSingleEvent } from '../../store/events'

const EventDetail = () => {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [host, setHost] = useState('')
  const event = useSelector(state => state.events.singleEvent)

  // console.log(event)

  useEffect(() => {
    const getSingleEvent = async () => {
      await dispatch(fetchSingleEvent(eventId))
      const res = await fetch(`/api/events/${eventId}/attendees`)
      const data = await res.json()
      console.log(data)
      setIsLoaded(true)
    }
    getSingleEvent()
  }, [dispatch])

  return (
    <div className='eventDetail'>
      {isLoaded ? (
        <div className='eventDetail-head'>
          <div className='eventDetail-back'>
            <p>{'<'}</p>
            <Link to='/events'>Events</Link>
          </div>
          <h2>{event.name}</h2>
        </div>
      ):(
        <h1>Loading</h1>
      )}
    </div>
  )
}

export default EventDetail
