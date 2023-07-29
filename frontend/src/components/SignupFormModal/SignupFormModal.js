import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { signup } from '../../store/session'
import { useModal } from '../../context/Modal'
import { useHistory } from 'react-router-dom'
import './SignupFormModal.css'

const SignupFormModal = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [disableButton, setDisableButton] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    setDisableButton(false)

    if (firstName.length === 0) {
      setDisableButton(true)
    }
    if (firstName.length === 0) {
      setDisableButton(true)
    }
    if (username.length < 4) {
      setDisableButton(true)
    }
    if (password.length < 6) {
      setDisableButton(true)
    }
    if (password !== confirmPassword) {
      setDisableButton(true)
    }

  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === confirmPassword) {
      setValidationErrors({})

      if (disableButton) return

      const user = {
        email,
        username,
        firstName,
        lastName,
        password
      }

      return dispatch(signup(user))
        .then(closeModal)
        .then(history.push('/'))
        .catch(async (res) => {
          const data = await res.json()
          if (data && data.errors) {
            setValidationErrors(data.errors)
          }
        })
    }

    return setValidationErrors({
      confirmPassword: 'Confirm Password field must be the same as the Password field'
    })
  }

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {validationErrors.firstName && <p className='errors'>{`* ${validationErrors.firstName}`}</p>}
          <input
            type='text'
            id='firstName'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder='First Name'
          />
        </div>
        <div>
          {validationErrors.lastName && <p className='errors'>{`* ${validationErrors.lastName}`}</p>}
          <input
            type='text'
            id='lastName'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder='Last Name'
          />
        </div>
        <div>
          {validationErrors.email && <p className='errors'>{`* ${validationErrors.email}`}</p>}
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
          />
        </div>
        <div>
          {validationErrors.username && <p className='errors'>{`* ${validationErrors.username}`}</p>}
          <input
            type='text'
            id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Username'
          />
        </div>
        <div>
          {validationErrors.password && <p className='errors'>{`* ${validationErrors.password}`}</p>}
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
          />
        </div>
        <div>
          {validationErrors.confirmPassword && <p className='errors'>{`* ${validationErrors.confirmPassword}`}</p>}
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
          />
        </div>
        <button
          type='submit'
          disabled={disableButton}
          className={disableButton ? 'disabled-button' : 'active-button'}
        >
          Signup</button>
      </form>
    </div>
  )
}

export default SignupFormModal
