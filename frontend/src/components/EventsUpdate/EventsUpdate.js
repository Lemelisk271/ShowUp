import EventsForm from '../EventsForm'
import { UseSelector, useSelector } from 'react-redux'

const EventsUpdate = () => {
  const event = useSelector(state => state.events.singleEvent)

  return (
    <EventsForm formType={'update'} event={event} />
  )
}

export default EventsUpdate
