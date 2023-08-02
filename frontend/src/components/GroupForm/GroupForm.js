import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import { addNewGroup } from '../../store/groups'

const GroupForm = () => {
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cityState, setCityState] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [type, setType] = useState('')
  const [privateSelect, setPrivateSelect] = useState('')
  const [privateState, setPrivateState] = useState(true)
  const [url, setUrl] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const errors = {}

    if (cityState.split(", ").length !== 2) {
      errors.city = 'Please enter a valid city and state in the format of "City, ST".'
    }
    if (name.length === 0) {
      errors.name = "Please enter a name for your group."
    }
    if (about.length === 0) {
      errors.about = "Please describe your group."
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
    if (url.length === 0) {
      errors.url = 'Please enter a URL'
    }

    setValidationErrors(errors)
  }, [cityState, name, about, type, privateSelect, url])

  useEffect(() => {
    const [inputCity, inputState] = cityState.split(", ")
    setCity(inputCity)
    setState(inputState)
  }, [cityState])

  if (!user) return <Redirect to='/' />

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitted(true)

    if (Object.values(validationErrors).length > 0) {
      return
    }

    const groupObj = {
      name,
      about,
      type,
      privateState,
      city,
      state,
      url
    }

    const group = await dispatch(addNewGroup(groupObj)).catch(async (res) => {
      const data = await res.json()
      if (data && data.errors) {
        setValidationErrors(data.errors)
      }
    })

    if (group) {
      history.push(`/groups/${group.id}`)
    }
  }

  return (
    <div className='groupForm'>
      <div className='groupForm-header'>
        <h1>Start a New Group</h1>
        <h2>We'll walk you through a few steps to build your local community</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='groupForm-location'>
          <h2>First, set your group's location.</h2>
          <p>Showup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
          <input
            type='text'
            placeholder='City, STATE'
            value={cityState}
            onChange={e => setCityState(e.target.value)}
          />
          <p className='errors'>{isSubmitted && validationErrors.city && `* ${validationErrors.city}`}</p>
          <p className='errors'>{isSubmitted && validationErrors.state && `* ${validationErrors.state}`}</p>
        </div>
        <div className='groupFrom-name'>
          <h2>What will your group's name be?</h2>
          <p>Choose a name that will give people a clear idea of that the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <input
            type='text'
            placeholder='What is your group name?'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <p className='errors'>{isSubmitted && validationErrors.name && `* ${validationErrors.name}`}</p>
        </div>
        <div className='groupForm-about'>
          <h2>Describe the purpose of your group.</h2>
          <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            value={about}
            onChange={e => setAbout(e.target.value)}
            placeholder='Please write at least 30 characters'
            rows="8"
            cols="50"
          />
          <p className='errors'>{isSubmitted && validationErrors.about && `* ${validationErrors.about}`}</p>
        </div>
        <div className='groupForm-final'>
          <h2>Final steps...</h2>
          <div>
            <label htmlFor='type'>Is this an in person or online group?</label>
            <select
              id='type'
              onChange={e => setType(e.target.value)}
              value={type}
            >
              <option value='' disabled>{'(select one)'}</option>
              <option>In person</option>
              <option>Online</option>
            </select>
            <p className='errors'>{isSubmitted && validationErrors.type && `* ${validationErrors.type}`}</p>
          </div>
          <div>
            <label htmlFor='privateSelect'>Is this group private or public?</label>
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
          <div>
            <label htmlFor='imageUrl'>Please add an image url for your group below:</label>
            <input
              type='url'
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder='Image Url'
            />
            <p className='errors'>{isSubmitted && validationErrors.url && `* ${validationErrors.url}`}</p>
          </div>
        </div>
        <button type='submit'>Create group</button>
      </form>
    </div>
  )
}

export default GroupForm
