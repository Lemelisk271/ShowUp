import { useModal } from '../../context/Modal'

const EventsDelete = () => {
  const { closeModal } = useModal()

  return(
    <div className="eventDelete">
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this event?</h3>
      <div className="eventDelete-buttons">
        <button className="eventDelete-deleteButton">Yes (Delete Event)</button>
        <button className="eventDelete-noButton" onClick={closeModal}>No (Keep Event)</button>
      </div>
    </div>
  )
}

export default EventsDelete
