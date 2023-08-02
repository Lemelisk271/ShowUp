import { useContext, useState, useEffect } from 'react'
import { GroupContext } from '../../context/GroupContext'
import { addNewEvent } from '../../store/events'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './EventsForm.css'

const EventsForm = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { currentGroup } = useContext(GroupContext)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [privateSelect, setPrivateSelect] = useState('')
  const [privateState, setPrivateState] = useState(true)
  const [price, setPrice] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  let today

  useEffect(() => {
    const currentDate = new Date
    const currentYear = currentDate.getFullYear()
    let currentMonth = currentDate.getMonth() + 1
    if (currentMonth < 10) {
      currentMonth = `0${currentMonth}`
    }
    let currentDay = currentDate.getDate()
    if (currentDay < 10) {
      currentDay = `0${currentDay}`
    }
    let currentHour = currentDate.getHours()
    if (currentHour < 10) {
      currentHour = `0${currentHour}`
    }
    let currentMin = currentDate.getMinutes()
    if (currentMin < 10) {
      currentMin = `0${currentMin}`
    }
    today = `${currentYear}-${currentMonth}-${currentDay}T${currentHour}:${currentMin}`
    setStartDate(today)
    setEndDate(today)
  }, [])

  useEffect(() => {
    const errors = {}
    const eventStart = new Date(startDate)
    const eventStartTime = eventStart.getTime()
    const eventEnd = new Date(endDate)
    const eventEndTime = eventEnd.getTime()
    const currentDate = Date.now()

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
    if (eventStartTime < currentDate) {
      errors.startDate = "Start date must be in the future"
    }
    if (eventStartTime > eventEndTime) {
      errors.endDate = "Please enter a date after the start date."
    }
    if (price < 0) {
      errors.price = "Price is invalid"
    }
    if (url.length === 0) {
      errors.url = "Please enter a url for your image."
    }
    if (description.length === 0) {
      errors.description = "Please add a description of your event."
    }

    setValidationErrors(errors)
  }, [name, type, privateSelect, startDate, endDate, price, url, description])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)

    if(Object.values(validationErrors).length) {
      return
    }

    const eventObj = {
      venueId: 1,
      groupId: currentGroup.id,
      name,
      type,
      capacity: 10,
      price,
      description,
      startDate,
      endDate,
      privateState,
      url
    }

    const event = await dispatch(addNewEvent(eventObj)).catch(async (res) => {
      const data = await res.json()
      if (data && data.errors) {
        setValidationErrors(data.errors)
      }
    })

    if (event) {
      history.push(`/events/${event.id}`)
    }
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
      <div className='eventForm-price'>
        <label htmlFor='price'>What is the price for your event?</label>
        <div className='eventForm-errors'>
          <div className='eventForm-priceInput'>
            <p>$</p>
            <input
              id='price'
              type='number'
              onChange={e => setPrice(parseFloat(e.target.value))}
              value={price}
              min='0'
              step={0.01}
            />
            <p className='errors'>{isSubmitted && validationErrors.price && `* ${validationErrors.price}`}</p>
          </div>
        </div>
      </div>
      <div className='eventForm-line'></div>
      <div className='eventForm-startDate'>
        <label htmlFor='startDate'>When does your event start?</label>
        <div className='eventForm-errors'>
          <input
            id='startDate'
            type='datetime-local'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            min={today}
          />
          <p className='errors'>{isSubmitted && validationErrors.startDate && `* ${validationErrors.startDate}`}</p>
        </div>
      </div>
      <div className='eventForm-startDate'>
        <label htmlFor='endDate'>When does your event end?</label>
        <div className='eventForm-errors'>
          <input
            id='endDate'
            type='datetime-local'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={today}
          />
          <p className='errors'>{isSubmitted && validationErrors.endDate && `* ${validationErrors.endDate}`}</p>
        </div>
      </div>
      <div className='eventForm-line'></div>
      <div className='eventForm-url'>
        <label htmlFor='imageUrl'>Please add an image url for your event below:</label>
        <div className='eventForm-errors'>
          <input
            type='url'
            value={url}
            id='imageUrl'
            onChange={e => setUrl(e.target.value)}
            placeholder='Image URL'
          />
          <p className='errors'>{isSubmitted && validationErrors.url && `* ${validationErrors.url}`}</p>
        </div>
      </div>
      <div className='eventForm-line'></div>
      <div className='eventForm-description'>
        <label htmlFor='description'>Please describe your event.</label>
        <div className='eventForm-errors'>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Please include at least 30 characters'
            rows="8"
            cols="50"
          />
          <p className='errors'>{isSubmitted && validationErrors.description && `* ${validationErrors.description}`}</p>
        </div>
      </div>
      <button type='submit'>Create Event</button>
    </form>
  )
}

export default EventsForm
