import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { signup } from '../../store/session'

const SignupFormPage = () => {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const valEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  if (sessionUser) return <Redirect to='/' />

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === confirmPassword) {
      const user = {
        email,
        username,
        firstName,
        lastName,
        password
      }

      return dispatch(signup(user)).catch(async (res) => {
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
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label htmlFor='email'>Email</label>
          {validationErrors.email && <p className='errors'>{`* ${validationErrors.email}`}</p>}
        </div>
        <div>
          <input
            type='text'
            id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label htmlFor='username'>Username</label>
          {validationErrors.username && <p className='errors'>{`* ${validationErrors.username}`}</p>}
        </div>
        <div>
          <input
            type='text'
            id='firstName'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <label htmlFor='firstName'>First Name</label>
          {validationErrors.firstName && <p className='errors'>{`* ${validationErrors.firstName}`}</p>}
        </div>
        <div>
          <input
            type='text'
            id='lastName'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <label htmlFor='lastName'>Last Name</label>
          {validationErrors.lastName && <p className='errors'>{`* ${validationErrors.lastName}`}</p>}
        </div>
        <div>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <label htmlFor='password'>Password</label>
          {validationErrors.password && <p className='errors'>{`* ${validationErrors.password}`}</p>}
        </div>
        <div>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <label htmlFor='confirmPassword'>Confirm Password</label>
          {validationErrors.confirmPassword && <p className='errors'>{`* ${validationErrors.confirmPassword}`}</p>}
        </div>
        <button type='submit'>Signup</button>
      </form>
    </div>
  )
}

export default SignupFormPage
