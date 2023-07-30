import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import OpenModalButton from '../OpenModalButton'
import SignupFormModal from '../SignupFormModal'

import computer_background from '../../images/computer_background.png'
import handsUp from '../../images/handsUp.svg'
import ticket from '../../images/ticket.svg'
import joinGroup from '../../images/joinGroup.svg'
import './Home.css'

const Home = () => {
  const sessionUser = useSelector(state => state.session.user)
  const [hover1, setHover1] = useState(false)
  const [hover2, setHover2] = useState(false)
  const [hover3, setHover3] = useState(false)

  let sessionLink
  let sessionButton

  if(sessionUser) {
    sessionLink = (
      <Link
        onMouseEnter={() => setHover3(true)}
        onMouseLeave={() => setHover3(false)}
        to='/groups/new'
      >
        <div className='home-active'>
          <img src={joinGroup} alt="Group" />
          <h4 className={hover3 ? "hover" : ""}>Start a new group</h4>
          <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
        </div>
      </Link>
    )
    sessionButton = (
      <></>
    )
  } else {
    sessionLink = (
      <div className='home-disabled'>
        <img src={joinGroup} alt="Group" />
        <h4>Start a new group</h4>
        <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
      </div>
    )
    sessionButton = (
      <OpenModalButton
        buttonText={'Join Showup'}
        modalComponent={<SignupFormModal />}
      />
    )
  }

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
          <Link
            onMouseEnter={() => setHover1(true)}
            onMouseLeave={() => setHover1(false)}
            to='/groups'
          >
            <div className='home-active'>
              <img src={handsUp} alt="Hands up" />
              <h4 className={hover1 ? "hover" : ""}>See all groups</h4>
              <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
            </div>
          </Link>
          <Link
            onMouseEnter={() => setHover2(true)}
            onMouseLeave={() => setHover2(false)}
            to='/events'
          >
            <div className='home-active'>
              <img src={ticket} alt="Ticket" />
              <h4 className={hover2 ? "hover" : ""}>Find an event</h4>
              <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
            </div>
          </Link>
          {sessionLink}
        </div>
      </div>
      {sessionButton}
    </div>
  )
}

export default Home
