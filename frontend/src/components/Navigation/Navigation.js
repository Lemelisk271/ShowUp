import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import OpenModalButton from '../OpenModalButton'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'
import './Navigation.css'
import Showup_logo from '../../images/Showup_logo.png'

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user)

  let sessionLinks

  if(sessionUser) {
    sessionLinks = (
      <div>
        <ProfileButton user={sessionUser} />
      </div>
    )
  } else {
    sessionLinks = (
      <div className="log-buttons" >
        <OpenModalButton
          buttonText={'Log In'}
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText={'Sign up'}
          modalComponent={<SignupFormModal />}
        />
      </div>
    )
  }

  return (
    <div className='nav-items'>
      <div className='nav-links'>
        <NavLink exact to='/'><img src={Showup_logo} alt="Showup Logo" /></NavLink>
      </div>
        {isLoaded && sessionLinks}
    </div>
  )
}

export default Navigation
