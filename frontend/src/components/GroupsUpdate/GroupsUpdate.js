import GroupForm from '../GroupForm'
import { GroupContext } from '../../context/GroupContext'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

const GroupsUpdate = () => {
  const { currentGroup } = useContext(GroupContext)
  const user = useSelector(state => state.session.user)

  if (!user) {
    return <Redirect to='/' />
  } else if (user.id !== currentGroup.organizerId) {
    return <Redirect to='/' />
  } else {
    return (
      <GroupForm formType={'update'} group={currentGroup} />
    )
  }
}

export default GroupsUpdate
