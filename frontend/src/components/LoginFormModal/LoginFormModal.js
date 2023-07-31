import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { login } from '../../store/session'
import { useModal } from '../../context/Modal'
import { useHistory } from 'react-router-dom'
import './LoginFormModal.css'

const LoginFormModal = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
      setDisableSubmit(true)
    } else {
      setDisableSubmit(false)
    }
  }, [credential, password])

  const onSubmit = (e) => {
    e.preventDefault()

    if (disableSubmit) return

    setErrors({})

    const user = {
      credential,
      password
    }

    return dispatch(login(user))
      .then(closeModal)
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      }
    )
  }

  const demoLogin = (e) => {
    e.preventDefault()

    const user = {
      credential: 'duser',
      password: 'password'
    }

    return dispatch(login(user))
      .then(closeModal)
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      })
  }

  return (
    <div className="login-page">
      <h1>Log In</h1>
      <form onSubmit={onSubmit}>
        <div>
          {errors.credential && <p className='errors'>{`* ${errors.credential}`}</p>}
          <input
            type='text'
            id='credential'
            value={credential}
            onChange={e => setCredential(e.target.value)}
            placeholder="Username or Email"
          />
        </div>
        <div>
          {errors.password && <p className='errors'>{`* ${errors.password}`}</p>}
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button
          disabled={disableSubmit}
          className={disableSubmit ? "disabled-button" : "active-button"}
        >
          Log In</button>
      </form>
      <button
        className="demo-button"
        onClick={demoLogin}
      >
        Demo User</button>
    </div>
  )
}

export default LoginFormModal
