import computer_background from '../../images/computer_background.png'
import handsUp from '../../images/handsUp.svg'
import ticket from '../../images/ticket.svg'
import joinGroup from '../../images/joinGroup.svg'
import './Home.css'

const Home = () => {
  return (
    <div className='home-page'>
      <div className='home-header'>
        <div>
          <h2>The people platform - Where interests become friendships</h2>
          <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Showup. Events are happening every day - log in to join the fun.</p>
        </div>
        <img src={computer_background} alt="Computer Video Call" />
      </div>
      <div className='home-main'>
        <div className='home-how'>
          <h3>How Showup works</h3>
          <p>Meet new people who share your interests through online and in-person events. It’s free to create an account.</p>
        </div>
        <div className='home-links'>
          <div>
            <img src={handsUp} alt="Hands up" />
            <h4>See all groups</h4>
            <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
          </div>
          <div>
            <img src={ticket} alt="Ticket" />
            <h4>Find an event</h4>
            <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
          </div>
          <div>
            <img src={joinGroup} alt="Group" />
            <h4>Start a new group</h4>
            <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
          </div>
        </div>
      </div>
      <button>Join Showup</button>
    </div>
  )
}

export default Home
