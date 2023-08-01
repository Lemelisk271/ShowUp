import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSingleEvent } from '../../store/events'
import './EventDetail.css'

const EventDetail = () => {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [host, setHost] = useState('')
  const [previewImg, setPreviewImg] = useState('')
  const [group, setGroup] = useState({})
  const [groupPreview, setGroupPreview] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const event = useSelector(state => state.events.singleEvent)

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
        setStartDate(`${startYear}-${startMonth}-${startDay} ${startTime}`)
        const end = new Date(event.startDate)
        const endMonth = end.getMonth() + 1
        const endDay = end.getDate()
        const endYear = end.getFullYear()
        const endTime = end.toLocaleTimeString()
        setEndDate(`${endYear}-${endMonth}-${endDay} ${endTime}`)
      }
    }
    loadPage()
    // eslint-disable-next-line
  }, [isLoaded, event])

  console.log(event)

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
                <img src={previewImg} alt={event.name} />
                <div className='eventDetail-side'>
                  <div className='eventDetail-groupCard'>
                    <img src={groupPreview} alt={group.name} />
                    <div className='eventDetail-cardInfo'>
                      <h3>{group.name}</h3>
                      <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                  </div>
                  <div className='eventDetail-eventCard'>
                    <div className='eventDetail-time'>
                      <i className="fa-regular fa-clock"></i>
                      <div className='eventDetail-start'>
                        <div className='eventDetail-startDate'>
                          <p>Start</p>
                          <p>{startDate}</p>
                        </div>
                        <div className='eventDetail-endDate'>
                          <p>End</p>
                          <p>{endDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className='eventDetail-price'>
                      <i class="fa-solid fa-money-bill-wave"></i>
                      <p>{`$ ${event.price}`}</p>
                    </div>
                    <div className='eventDetail-location'>
                      <i class="fa-solid fa-map-pin"></i>
                      <p>{event.type}</p>
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
