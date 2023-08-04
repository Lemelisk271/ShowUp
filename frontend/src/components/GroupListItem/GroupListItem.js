import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GroupListItem = ({ group, member }) => {
  const [groupEvents, setGroupEvents] = useState([])
  const [memberButtons, setMemberButtons] = useState('')
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`/api/groups/${group.id}/events`)
      const data = await res.json()
      setGroupEvents(data.Events)

      if (member) {
        const memberRes = await fetch(`/api/groups/${group.id}/members`)
        const memberData = await memberRes.json()
        const memberUser = memberData.Members.find(member => member.id === user.id)
        const membershipStatus = memberUser.Membership.status
        if (membershipStatus) {
          let buttons
          if (membershipStatus === 'host') {
            buttons = (
              <>
                <button>Update</button>
                <button>Delete</button>
              </>
            )
          } else {
            buttons = (
              <button>Unjoin</button>
            )
          }
          setMemberButtons(buttons)
        }
      }
    }
    fetchEvents()
    // eslint-disable-next-line
  }, [])

  const shortAbout = group.about.slice(0, 300)
  let about
  if (group.about.length < 300) {
    about = group.about
  } else {
    about = shortAbout + "..."
  }

  return (
    <Link to={`/groups/${group.id}`}>
      <div className="groupList-item">
        <img src={group.previewImage} alt={group.name} />
        <div className="group-info">
          <h2>{group.name}</h2>
          <p>{`${group.city}, ${group.state}`}</p>
          <p>{about}</p>
          <div className="groupList-bottom">
            <div className="groupListItem-events">
              <p>{`${groupEvents.length} events`}</p>
              <i className="fa-solid fa-circle"></i>
              <p>{`${group.private ? "Private" : "Public"}`}</p>
            </div>
            <div className="groupListItem-membership">
              {member ? memberButtons : ""}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GroupListItem
