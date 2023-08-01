import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchSingleGroup } from '../../store/groups'
import EventListItem from '../EventListItem'
import OpenModalButton from '../OpenModalButton'
import ComingSoon from '../ComingSoon'
import './GroupDetail.css'

const GroupDetail = () => {
  const dispatch = useDispatch()
  const { groupId } = useParams()
  const [isLoaded, setIsLoaded] = useState(false)
  const [previewImg, setPreviewImg] = useState({})
  const [groupEvents, setGroupEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOrganizer, setIsOrganizer] = useState(false)
  const group = useSelector(state => state.groups.singleGroup)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    const singleGroup = async () => {
      await dispatch(fetchSingleGroup(groupId))
      const res = await fetch(`/api/groups/${groupId}/events`)
      const data = await res.json()
      setGroupEvents(data.Events)
      setIsLoaded(true)
    }
    singleGroup()
    // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    if (isLoaded) {
      const preview = group.GroupImages.find(img => img.preview === true)
      setPreviewImg(preview)
      if (user) {
        setIsLoggedIn(true)
        if (user.id === group.Organizer.id) {
          setIsOrganizer(true)
        }
      }
    }
    // eslint-disable-next-line
  }, [group, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      const newEvents = []
      const oldEvents = []
      groupEvents.forEach(event => {
        const eventDate = new Date(event.startDate)
        const eventTime = eventDate.getTime()
        const today = Date.now()
        if (eventTime >= today) {
          newEvents.push(event)
        } else {
          oldEvents.push(event)
        }
      })
      oldEvents.sort(function(a, b) {
        return new Date(b.startDate) - new Date(a.startDate)
      })
      newEvents.sort(function(a, b) {
        return new Date(a.startDate) - new Date(b.startDate)
      })
      setUpcomingEvents(newEvents)
      setPastEvents(oldEvents)
    }
  }, [groupEvents, isLoaded])

  return (
    <div className='groupDetail-main'>
      {isLoaded ? (
        <>
          <div className='groupDetail-top'>
            <div className='groupDetail-back'>
              <p>{'<'}</p>
              <Link to='/groups'>Groups</Link>
            </div>
            <div className='groupDetail-header'>
              <div className='groupDetail-headerImg'>
                <img src={previewImg.url} alt={group.name} />
              </div>
              <div className='groupDetail-groupInfo'>
                <div className='groupDetail-groupText'>
                  <h1>{group.name}</h1>
                  <p>{`${group.city}, ${group.state}`}</p>
                  <div className='groupDetail-events'>
                    <p>{`${groupEvents.length} events`}</p>
                    <i className="fa-solid fa-circle"></i>
                    <p>{`${group.private ? "Private" : "Public"}`}</p>
                  </div>
                  <p>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                </div>
                <div className='groupDetail-buttons'>
                  {isLoggedIn && !isOrganizer ? (
                    <div className='groupDetail-join'>
                      <OpenModalButton
                        buttonText={'Join this group'}
                        modalComponent={<ComingSoon />}
                      />
                    </div>
                  ):(
                    <></>
                  )}
                  {isOrganizer ? (
                    <div className='groupDetails-organizer'>
                      <button>Create Event</button>
                      <button>Update</button>
                      <button>Delete</button>
                    </div>
                  ):(
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='groupDetail-bottom'>
            <div className='groupDetail-body'>
              <div className='groupDetail-org'>
                <h2>Organizer</h2>
                <p>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
              </div>
              <div className='groupDetail-about'>
                <h2>What we're about</h2>
                <p>{group.about}</p>
              </div>
              <div className='groupDetail-upcoming'>
                {upcomingEvents.length ? (
                  <>
                  <h2>{`Upcoming Events (${upcomingEvents.length})`}</h2>
                  {upcomingEvents.map(event => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                  </>
                ):("")}
              </div>
              <div className='groupDetail-past'>
                {pastEvents.length ? (
                  <>
                  <h2>{`Past Events (${pastEvents.length})`}</h2>
                  {pastEvents.map(event => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                  </>
                ):("")}
              </div>
            </div>
          </div>
        </>
      ):(
        <h1>Loading</h1>
      )}
    </div>
  )
}

export default GroupDetail
