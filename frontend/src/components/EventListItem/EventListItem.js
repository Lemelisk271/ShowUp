import { useEffect, useState } from 'react'

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
    <div className="eventListItem">
      <div className="eventListItem-header">
        <img src={event.previewImage} alt={event.name} />
        <div className="eventListItem-info">
          <p>{`${year}-${month}-${day} ${time}`}</p>
          <h2>{event.name}</h2>
          <p>{`${event.Venue.city}, ${event.Venue.state}`}</p>
        </div>
      </div>
      <div className='eventListItem-body'>
        <p>{eventDetails.description}</p>
      </div>
    </div>
  )
}

export default EventListItem
