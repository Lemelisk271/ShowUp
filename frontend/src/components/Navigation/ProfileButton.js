import { logout } from '../../store/session'
import { useDispatch } from 'react-redux'

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch()

  const logoutUser = (e) => {
    e.preventDefault()
    dispatch(logout())
  }

  const ulClassName = "profile-dropdown"

  return (
    <>
      <button className="user-icon">
        <i class="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logoutUser}>Log Out</button>
        </li>
      </ul>
    </>
  )
}

export default ProfileButton
