import { logout } from '../../store/session'
import { useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch()
  const history = useHistory()
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
    dispatch(logout()).then(history.push('/'))
  }

  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : ' hidden')
  const arrowClassName = "fa-solid" + (showMenu ? " fa-angle-up" : " fa-angle-down")

  return (
    <div className='icon-div'>
      <button className="user-icon" onClick={openMenu}>
        <i className="fa-solid fa-circle-user"></i>
        <i style={{color: 'lightgrey', fontSize: '30px'}} className={arrowClassName}></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li>{user.email}</li>
        <li><Link to='/groups'>View Groups</Link></li>
        <li><Link to='/events'>View Events</Link></li>
        <div className='dropdown-line'></div>
        <li><Link to='/groups/current'>My Groups</Link></li>
        <div className='dropdown-line'></div>
        <li>
          <button onClick={logoutUser}>Log Out</button>
        </li>
      </ul>
    </div>
  )
}

export default ProfileButton
