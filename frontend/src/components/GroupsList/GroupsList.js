import { Link } from 'react-router-dom'
import GroupListItem from '../GroupListItem'

const GroupsList = () => {
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
