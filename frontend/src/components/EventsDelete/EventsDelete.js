import { useModal } from '../../context/Modal'
import { removeEvent } from '../../store/events'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import './EventsDelete.css'

const EventsDelete = ({ eventId, groupId }) => {
  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const history = useHistory()
  const [errors, setErrors] = useState({})

  const onDelete = () => {
    return dispatch(removeEvent(eventId))
      .then(closeModal)
      .then(history.push(`/groups/${groupId}`))
      .catch(async (res) => {
        const data = res.json()
        if (data && data.errors) setErrors(data.errors)
      })
  }

  return(
    <div className="eventDelete">
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this event?</h3>
      <p className='errors'>{errors.message && `* ${errors.message}`}</p>
      <div className="eventDelete-buttons">
        <button className="eventDelete-deleteButton" onClick={onDelete}>Yes (Delete Event)</button>
        <button className="eventDelete-noButton" onClick={closeModal}>No (Keep Event)</button>
      </div>
    </div>
  )
}

export default EventsDelete
