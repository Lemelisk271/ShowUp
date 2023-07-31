import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGroups } from '../../store/groups'
import GroupListItem from '../GroupListItem'

const GroupsList = () => {
  const dispatch = useDispatch()
  let groups = useSelector(state => state.groups.allGroups)
  const [isLoaded, setIsLoaded] = useState(false)
  const [groupList, setGroupList] = useState([])

  useEffect(() => {
    const getGroups = async () => {
      await dispatch(fetchGroups())
      setIsLoaded(true)
    }
    getGroups()
  }, [dispatch])

  useEffect(() => {
    if (isLoaded) {
      setGroupList(Object.values(groups))
    }
  }, [isLoaded, groups])

  return (
    <div className='groupList'>
      <div className='groupList-header'>
        <div>
          <Link to='/events'>Events</Link>
          <p>Group</p>
        </div>
        <p>Groups in Showup</p>
      </div>
      <div className='groupList-main'>
        {isLoaded ? (
          groupList.map(group => (
            <GroupListItem key={group.id} group={group} />
          ))
        ):(
          <h1>loading</h1>
        )}
      </div>
    </div>
  )
}

export default GroupsList
