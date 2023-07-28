import { useState } from "react"
import { useDispatch } from 'react-redux'
import { login } from '../../store/session'
import { useModal } from '../../context/Modal'

const LoginFormModal = () => {
  const dispatch = useDispatch()
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')
  const { closeModal } = useModal()

  const onSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    const user = {
      credential,
      password
    }

    return dispatch(login(user))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      }
    )
  }

  return (
    <div className="login-page">
      <h1>Log In</h1>
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

export default LoginFormModal
