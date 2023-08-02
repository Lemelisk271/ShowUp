import { useModal } from '../../context/Modal'
import { removeGroup } from '../../store/groups'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import './GroupsDelete.css'

const GroupsDelete = ({ groupId }) => {
  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const history = useHistory()
  const [errors, setErrors] = useState({})

  const onDelete = () => {
    return dispatch(removeGroup(groupId))
      .then(closeModal)
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      })
  }

  return (
    <div className="groupDelete">
      <h1>Confirm Delete</h1>
      <h3>Are you sure that you want to remove this group?</h3>
      <p className='errors'>{errors.message && `* ${errors.message}`}</p>
      <div className="groupDelete-buttons">
        <button className="groupDelete-deleteButton" onClick={onDelete}>Yes (Delete Group)</button>
        <button className='groupDelete-noButton' onClick={closeModal}>No (Keep Group)</button>
      </div>
    </div>
  )
}

export default GroupsDelete
