import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchSingleGroup } from '../../store/groups'

const GroupDetail = () => {
  const dispatch = useDispatch()
  const { groupId } = useParams()
  const [isLoaded, setIsLoaded] = useState(false)
  const [previewImg, setPreviewImg] = useState({})
  const [groupEvents, setGroupEvents] = useState([])
  const group = useSelector(state => state.groups.singleGroup)

  console.log(group)

  useEffect(() => {
    const singleGroup = async () => {
      await dispatch(fetchSingleGroup(groupId))
      const res = await fetch(`/api/groups/${groupId}/events`)
      const data = await res.json()
      setGroupEvents(data.Events)
      setIsLoaded(true)
    }
    singleGroup()
  }, [dispatch])

  useEffect(() => {
    if (isLoaded) {
      const preview = group.GroupImages.find(img => img.preview === true)
      setPreviewImg(preview)
    }
  }, [group, isLoaded])

  return (
    <div className='groupDetail-main'>
      {isLoaded ? (
        <>
          <div className='groupDetail-back'>
            <p>{'<'}</p>
            <Link to='/groups'>Groups</Link>
          </div>
          <div className='groupDetail-header'>
            <div className='groupDetail-headerImg'>
              <img src={previewImg.url} alt={`${group.name} Preview Image`} />
            </div>
            <div className='groupDetail-groupInfo'>
              <div className='groupDetail-groupText'>
                <h1>{group.name}</h1>
                <p>{`${group.city}, ${group.state}`}</p>
                <p>{`${groupEvents.length} events . ${group.private ? "Private" : "Public"}`}</p>
                <p>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
              </div>
              <button>Join this group</button>
            </div>
          </div>
          <div className='groupDetail-body'></div>
        </>
      ):(
        <h1>Loading</h1>
      )}
    </div>
  )
}

export default GroupDetail
