import { useContext, useState, useEffect } from 'react'
import { GroupContext } from '../../context/GroupContext'

const EventsForm = () => {
  const { currentGroup } = useContext(GroupContext)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [privateSelect, setPrivateSelect] = useState('')
  const [privateState, setPrivateState] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const errors = {}

    if (name.length === 0) {
      errors.name = "Please enter a name for the event."
    }
    if (!['In person', 'Online'].includes(type)) {
      errors.type = "Please select your group's type."
    }
    if (!['Public', 'Private'].includes(privateSelect)) {
      errors.private = "Please select Public or Private"
    }
    if (privateSelect === 'Public') {
      setPrivateState(false)
    }

    setValidationErrors(errors)
  }, [name, type, privateSelect])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)

    if(Object.values(validationErrors).length) {
      return
    }

    const eventObj = {
      name,
      type,
      privateState
    }

    console.log(eventObj)

    setName('')
    setType('')
    setPrivateSelect('')
    setPrivateState(false)
    setIsSubmitted(false)
  }

  return (
    <form className='eventForm' onSubmit={handleSubmit}>
      <h2>{`Create an event for ${currentGroup.name}`}</h2>
      <div className='eventForm-name'>
        <label htmlFor='name'>What is the name of the event?</label>
        <div className='eventForm-errors'>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Event Name'
          />
          <p className='errors'>{isSubmitted && validationErrors.name && `* ${validationErrors.name}`}</p>
        </div>
      </div>
      <div className='eventForm-line'></div>
      <div className='eventFrom-type'>
        <label htmlFor='type'>Is this an in person or online event?</label>
        <div className='eventForm-errors'>
          <select
            id='type'
            onChange={e => setType(e.target.value)}
            value={type}
          >
            <option value = '' disabled>{'(select one)'}</option>
            <option>In person</option>
            <option>Online</option>
          </select>
          <p className='errors'>{isSubmitted && validationErrors.type && `* ${validationErrors.type}`}</p>
        </div>
      </div>
      <div className='eventForm-private'>
        <label htmlFor='privateSelect'>Is this event event private or public?</label>
        <div className='eventForm-errors'>
          <select
            id='privateSelect'
            onChange={e => setPrivateSelect(e.target.value)}
            value={privateSelect}
          >
            <option value='' disabled>{'(select one)'}</option>
            <option>Private</option>
            <option>Public</option>
          </select>
          <p className='errors'>{isSubmitted && validationErrors.private && `* ${validationErrors.private}`}</p>
        </div>
      </div>
      <button type='submit'>Create Event</button>
    </form>
  )
}

export default EventsForm
