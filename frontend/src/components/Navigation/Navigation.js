import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/session'
import ProfileButton from './ProfileButton'
import './Navigation.css'

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()

  const logoutUser = (e) => {
    e.preventDefault()
    dispatch(logout())
  }

  let sessionLinks

  if(sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        <button onClick={logoutUser}>Log Out</button>
      </li>
    )
  } else {
    sessionLinks = (
      <li>
        <NavLink to='/login'>Log In</NavLink>
        <NavLink to='/signup'>Sign Up</NavLink>
      </li>
    )
  }

  return (
    <>
      <ul>
        <li><NavLink exact to='/'>Home</NavLink></li>
        {isLoaded && sessionLinks}
      </ul>
    </>
  )
}

export default Navigation
