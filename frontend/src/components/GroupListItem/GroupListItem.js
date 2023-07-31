import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

const GroupListItem = ({ group }) => {
  const [groupEvents, setGroupEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`/api/groups/${group.id}/events`)
      const data = await res.json()
      setGroupEvents(data.Events)
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
          <p>{`${groupEvents.length} events - ${group.private ? "Private" : "Public"}`}</p>
        </div>
      </div>
    </Link>
  )
}

export default GroupListItem
