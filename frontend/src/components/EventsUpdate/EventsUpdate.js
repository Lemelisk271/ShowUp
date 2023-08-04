import EventsForm from '../EventsForm'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const EventsUpdate = () => {
  const history = useHistory()
  const event = useSelector(state => state.events.singleEvent)
  const user = useSelector(state => state.session.user)

  const checkUser = async () => {
    const res = await fetch(`/api/events/${event.id}/attendees`)
    const data = await res.json()
    const authUser = data.Attendees.find(user => user.Attendance.status === 'host')
    if (authUser.id !== user.id) history.push('/')
  }

  checkUser()

  return (
    <EventsForm formType={'update'} event={event} />
  )
}

export default EventsUpdate
