import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/session'
import { Redirect } from 'react-router-dom'

const LoginFormPage = () => {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')

  if (sessionUser) return <Redirect to='/' />

  const onSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    const user = {
      credential,
      password
    }

    dispatch(login(user)).catch(
      async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      }
    )
  }

  return (
    <div className="login-page">
      <h1>Login Form</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type='text'
            id='credential'
            value={credential}
            onChange={e => setCredential(e.target.value)}
          />
          <label htmlFor="credential">Username or E-Mail</label>
          {errors.credential && <p className='errors'>{`* ${errors.credential}`}</p>}
        </div>
        <div>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          {errors.password && <p className='errors'>{`* ${errors.password}`}</p>}
        </div>
        <button>Log In</button>
      </form>
    </div>
  )
}

export default LoginFormPage
