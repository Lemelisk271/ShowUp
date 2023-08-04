import EventsForm from '../EventsForm'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

const EventsNew = () => {
  const user = useSelector(state => state.session.user)

  if (!user) {
    return <Redirect to='/' />
  } else {
    return (
      <EventsForm formType={"create"} event={null} />
    )
  }
}

export default EventsNew
