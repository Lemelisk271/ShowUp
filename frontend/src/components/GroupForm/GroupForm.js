import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import { addNewGroup, updateGroup } from '../../store/groups'
import './GroupForm.css'

const GroupForm = ({ formType, group }) => {
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
  const [imageId, setImageId] = useState(1)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (formType === 'update') {
      setCityState(`${group.city}, ${group.state}`)
      setCity(group.city)
      setState(group.state)
      setName(group.name)
      setAbout(group.about)
      setType(group.type)
      if (group.private === true) {
        setPrivateSelect('Private')
        setPrivateState(true)
      }
      if (group.private === false) {
        setPrivateSelect('Public')
        setPrivateState(false)
      }

      const previewImage = group.GroupImages.find(image => image.preview === true)
      setImageId(previewImage.id)
      setUrl(previewImage.url)
    }
  }, [])

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
  if (formType === 'update' && user.id !== group.organizerId) <Redirect to='/' />
  if (formType === 'update' && !group) <Redirect to='/' />


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

    if (formType === 'create') {
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
    if (formType === 'update') {
      groupObj.imageId = imageId
      groupObj.groupId = group.id

      const updatedGroup = await dispatch(updateGroup(groupObj)).catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) {
          setValidationErrors(data.errors)
        }
      })

      if (updatedGroup) {
        history.push(`/groups/${updatedGroup.id}`)
      }
    }
  }

  return (
    <div className='groupForm'>
      <div className='groupForm-header'>
        {formType === 'create' ? (
          <>
            <h1>Start a New Group</h1>
            <h2>We'll walk you through a few steps to build your local community</h2>
          </>
        ):(
          <>
            <h1>Update Your Group's Information</h1>
            <h2>We'll walk you through a few steps to update your group's information</h2>
          </>
        )}
      </div>
      <div className='groupForm-line'></div>
      <form onSubmit={handleSubmit} className='groupForm-form'>
        <div className='groupForm-location'>
          <h2>First, set your group's location.</h2>
          <p>Showup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
          <div className='groupForm-errors'>
            <input
              type='text'
              placeholder='City, STATE'
              value={cityState}
              onChange={e => setCityState(e.target.value)}
            />
            <p className='errors'>{isSubmitted && validationErrors.city && `* ${validationErrors.city}`}</p>
            <p className='errors'>{isSubmitted && validationErrors.state && `* ${validationErrors.state}`}</p>
          </div>
        </div>
        <div className='groupForm-line'></div>
        <div className='groupForm-name'>
          <h2>What will your group's name be?</h2>
          <p>Choose a name that will give people a clear idea of that the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <div className='groupForm-errors'>
            <input
              type='text'
              placeholder='What is your group name?'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <p className='errors'>{isSubmitted && validationErrors.name && `* ${validationErrors.name}`}</p>
          </div>
        </div>
        <div className='groupForm-line'></div>
        <div className='groupForm-about'>
          <h2>Describe the purpose of your group.</h2>
          <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <div className='groupForm-errors'>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder='Please write at least 30 characters'
              rows="8"
              cols="50"
            />
            <p className='errors'>{isSubmitted && validationErrors.about && `* ${validationErrors.about}`}</p>
          </div>
        </div>
        <div className='groupForm-line'></div>
        <div className='groupForm-final'>
          <h2>Final steps...</h2>
          <div className='groupForm-type'>
            <label htmlFor='type'>Is this an in person or online group?</label>
            <div className='groupForm-errors'>
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
          </div>
          <div className='createForm-private'>
            <label htmlFor='privateSelect'>Is this group private or public?</label>
            <div className='groupForm-errors'>
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
          <div className='createForm-url'>
            <label htmlFor='imageUrl'>Please add an image url for your group below:</label>
            <div className='groupForm-errors'>
              <input
                type='url'
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder='Image Url'
              />
              <p className='errors'>{isSubmitted && validationErrors.url && `* ${validationErrors.url}`}</p>
            </div>
          </div>
        </div>
        <div className='groupForm-line'></div>
        <button type='submit'>{formType === 'create' ? "Create Group" : "Update Group"}</button>
      </form>
    </div>
  )
}

export default GroupForm
