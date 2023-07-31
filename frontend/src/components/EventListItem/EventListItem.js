import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const EventListItem = ({ event }) => {
  const [eventDetails, setEventDetails] = useState({})

  useEffect(() => {
    const getSingleEvent = async (id) => {
      const res = await fetch(`/api/events/${id}`)
      const data = await res.json()
      setEventDetails(data)
    }
    getSingleEvent(event.id)
  }, [event.id])

  const startTime = new Date(event.startDate)

  const month = startTime.getMonth() + 1
  const day = startTime.getDate()
  const year = startTime.getFullYear()
  const time = startTime.toLocaleTimeString()

  return (
    <Link to={`/events/${event.id}`}>
      <div className="eventListItem">
        <div className="eventListItem-header">
          <img src={event.previewImage} alt={event.name} />
          <div className="eventListItem-info">
            <div className='eventListItem-date'>
              <p>{`${year}-${month}-${day}`}</p>
              <i className="fa-solid fa-circle"></i>
              <p>{`${time}`}</p>
            </div>
            <h2>{event.name}</h2>
            <p>{`${event.Venue.city}, ${event.Venue.state}`}</p>
          </div>
        </div>
        <div className='eventListItem-body'>
          <p>{eventDetails.description}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventListItem
