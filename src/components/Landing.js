import React from 'react'

const Landing = (props) => (
  <div>
    <div id='landing-header'>
      <div id='icon'></div>
      <div id='landing-title'>
        <div id='title-slogan'>
          <h1 id='landing-title-h1'>BOOKing.</h1>
          <h2 id='landing-title-h2'>Create and manage your appointments with ease.</h2>
        </div>
      </div>
      <div id='landing-buttons'>
        <button className='landing-button' onClick={ () => props.history.push('/login') }>Sign In</button>
        <button className='landing-button' onClick={ () => props.history.push('/register') }>Register</button>
      </div>
    </div>
    <div id='site-info'>
      <h1 id='about-us'>ABOUT US</h1>
      <p id='site-info-text'>
        Here at BOOKing, we believe in giving power to self-employed professionals.
        We understand that it is difficult to maintain appointments while serving valued clients.
        Our platform provides an easier way for your clients to book an appointment with you and for yourself to view and maintain your bookings.
      </p>
    </div>
    <div id='site-features-container'>
      <h1 id='site-features-title'>WHAT WE OFFER</h1>
      <i id='features-calendar' className="far fa-calendar-alt"></i>
      <div id='site-features'>
        <div className='site-feature'>
          <i id='feature-checkmark' className="far fa-check-circle"></i>
          <p>Effortless online bookings.</p>
        </div>
        <br></br>
        <div className='site-feature'>
          <i id='feature-checkmark' className="far fa-check-circle"></i>
          <p>Automated email reminders.</p>
        </div>
        <br></br>
        <div className='site-feature'>
          <i id='feature-checkmark' className="far fa-check-circle"></i>
          <p>Detailed booking information.</p>
        </div>
        <br></br>
        <div className='site-feature'>
          <i id='feature-checkmark' className="far fa-check-circle"></i>
          <p>Modify availability on the fly.</p>
        </div>
      </div>
    </div>
  </div>
)

export default Landing;
