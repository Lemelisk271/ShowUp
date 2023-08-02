import GroupForm from '../GroupForm'
import { GroupContext } from '../../context/GroupContext'
import { useContext } from 'react'

const GroupsUpdate = () => {
  const { currentGroup } = useContext(GroupContext)

  return (
    <GroupForm formType={'update'} group={currentGroup} />
  )
}

export default GroupsUpdate
