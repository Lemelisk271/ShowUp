import { Link, useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSingleEvent } from '../../store/events'
import EventsDelete from '../EventsDelete'
import OpenModalButton from '../OpenModalButton'
import './EventDetail.css'

const EventDetail = () => {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [isLoaded, setIsLoaded] = useState(false)
  const [host, setHost] = useState('')
  const [previewImg, setPreviewImg] = useState('')
  const [group, setGroup] = useState({})
  const [groupPreview, setGroupPreview] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTimeState, setStartTimeState] = useState('')
  const [endTimeState, setEndTimeState] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isHost, setIsHost] = useState(false)
  const event = useSelector(state => state.events.singleEvent)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    const getSingleEvent = async () => {
      await dispatch(fetchSingleEvent(eventId))
      const attendees = await fetch(`/api/events/${eventId}/attendees`)
      const attendeesData = await attendees.json()
      const hostData = attendeesData.Attendees.find(user => user.Attendance.status === 'host')
      setHost(hostData)
      setIsLoaded(true)
    }
    getSingleEvent()
    // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    const loadPage = async () => {
      if (isLoaded) {
        const img = event.EventImages.find(image => image.preview === true)
        setPreviewImg(img.url)
        const group = await fetch(`/api/groups/${event.groupId}`)
        const groupData = await group.json()
        setGroup(groupData)
        let groupImage = groupData.GroupImages.find(image => image.preview === true)
        setGroupPreview(groupImage.url)
        const start = new Date(event.startDate)
        const startMonth = start.getMonth() + 1
        const startDay = start.getDate()
        const startYear = start.getFullYear()
        const startTime = start.toLocaleTimeString()
        setStartDate(`${startYear}-${startMonth}-${startDay}`)
        setStartTimeState(`${startTime}`)
        const end = new Date(event.endDate)
        const endMonth = end.getMonth() + 1
        const endDay = end.getDate()
        const endYear = end.getFullYear()
        const endTime = end.toLocaleTimeString()
        setEndDate(`${endYear}-${endMonth}-${endDay}`)
        setEndTimeState(`${endTime}`)
        if (user) {
          if (user.id === host.id) {
            setIsHost(true)
          }
        }
      }
    }
    loadPage()
    // eslint-disable-next-line
  }, [isLoaded, event])

  return (
    <div className='eventDetail'>
      {isLoaded ? (
        <>
          <div className='eventDetail-head'>
            <div className='eventDetail-back'>
              <p>{'<'}</p>
              <Link to='/events'>Events</Link>
            </div>
            <h2>{event.name}</h2>
            <p>{`Hosted by ${host.firstName} ${host.lastName}`}</p>
          </div>
          <div className='eventDetail-bottom'>
            <div className='eventDetail-body'>
              <div className='eventDetail-info'>
                <div className='eventDetail-img'>
                  <img src={previewImg} alt={event.name} />
                </div>
                <div className='eventDetail-side'>
                  <Link to={`/groups/${event.groupId}`}>
                    <div className='eventDetail-groupCard'>
                      <img src={groupPreview} alt={group.name} />
                      <div className='eventDetail-cardInfo'>
                        <h3>{group.name}</h3>
                        <p>{group.private ? "Private" : "Public"}</p>
                      </div>
                    </div>
                  </Link>
                  <div className='eventDetail-eventCard'>
                    <div className='eventDetail-time'>
                      <i className="fa-regular fa-clock"></i>
                      <div className='eventDetail-start'>
                        <div className='eventDetail-startDate'>
                          <p>Start</p>
                          <p>{startDate}</p>
                          <i className="fa-solid fa-circle"></i>
                          <p>{startTimeState}</p>
                        </div>
                        <div className='eventDetail-endDate'>
                          <p>End</p>
                          <p>{endDate}</p>
                          <i className="fa-solid fa-circle"></i>
                          <p>{endTimeState}</p>
                        </div>
                      </div>
                    </div>
                    <div className='eventDetail-price'>
                      <i className="fa-solid fa-money-bill-wave"></i>
                      <p>{`$${parseInt(event.price) === 0 ? ' FREE' : `${event.price}`}`}</p>
                    </div>
                    <div className='eventDetail-groupBottom'>
                      <div className='eventDetail-location'>
                        <i className="fa-solid fa-map-pin"></i>
                        <p>{event.type}</p>
                      </div>
                      <div className='eventDetail-buttons'>
                        {isHost ? (
                          <>
                            <button onClick={() => history.push(`/events/${event.id}/edit`)}>Update</button>
                            <OpenModalButton
                              buttonText={'Delete'}
                              modalComponent={<EventsDelete eventId={eventId} groupId={event.groupId}/>}
                            />
                          </>
                        ):(
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='eventDetail-details'>
                <h2>Details</h2>
                <p>{event.description}</p>
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

export default EventDetail
