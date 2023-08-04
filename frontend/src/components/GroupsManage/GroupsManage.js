import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserGroup } from '../../store/groups'
import GroupListItem from '../GroupListItem'
import './GroupsManage.css'

const GroupsManage = () => {
  const dispatch = useDispatch()
  const groups = Object.values(useSelector(state => state.groups.userGroups))
  const [isLoaded, setIsLoaded] = useState(false)

  console.log(groups)

  useEffect(() => {
    const getUserGroups = async () => {
      await dispatch(fetchUserGroup())
      setIsLoaded(true)
    }
    getUserGroups()
  }, [dispatch])

  return (
    <div className='groupsManage'>
      <div className='groupsManage-header'>
        <h2>Manage Groups</h2>
        <p>Your groups in Showup</p>
      </div>
      <div className='groupsManage-main'>
        {isLoaded ? (
          groups.map(group => (
            <GroupListItem key={group.id} group={group} />
          ))
        ):(
          <h1>Loading</h1>
        )}
      </div>
    </div>
  )
}

export default GroupsManage
