import EventsForm from '../EventsForm'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { GroupContext } from '../../context/GroupContext'
import { useContext } from 'react'

const EventsNew = () => {
  const user = useSelector(state => state.session.user)
  const { currentGroup } = useContext(GroupContext)

  if (!user) {
    return <Redirect to='/' />
  } else if (currentGroup.organizerId === user.id) {
    return (
      <EventsForm formType={"create"} event={null} />
    )
  } else {
    return <Redirect to='/' />
  }
}

export default EventsNew
