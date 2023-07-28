import { logout } from '../../store/session'
import { useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()

  useEffect(() => {
    if (!showMenu) return

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => document.removeEventListener('click', closeMenu)
  }, [showMenu])

  const logoutUser = (e) => {
    e.preventDefault()
    dispatch(logout())
  }

  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : ' hidden')

  return (
    <>
      <button className="user-icon" onClick={openMenu}>
        <i class="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
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
