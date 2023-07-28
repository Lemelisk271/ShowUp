import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import './Navigation.css'

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user)

  let sessionLinks

  if(sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
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
      <ul className='nav-links'>
        <li><NavLink exact to='/'>Home</NavLink></li>
        {isLoaded && sessionLinks}
      </ul>
    </>
  )
}

export default Navigation
