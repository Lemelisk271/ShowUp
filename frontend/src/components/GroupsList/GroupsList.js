import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGroups } from '../../store/groups'
import GroupListItem from '../GroupListItem'

const GroupsList = () => {
  const dispatch = useDispatch()
  const groups = useSelector(state => state.groups.allGroups)
  const groupList = Object.values(groups)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getGroups = async () => {
      await dispatch(fetchGroups())
      setIsLoaded(true)
    }
    getGroups()
  }, [dispatch])

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
        <GroupListItem />
      </div>
    </div>
  )
}

export default GroupsList
