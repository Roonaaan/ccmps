import React from 'react'

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

// CSS
import './styles/Forgotpassword.css'

// Logo
import Logo from '../../assets/login/logo-dark.png'

const Forgotpassmessage = ({ onClose, email }) => {

  // Resend Email Connection
  const resendEmail = async () => {
    try {
      const response = await fetch('https://ccmps-server-node.vercel.app/api/auth/resend-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Email resent successfully');
      } else {
        console.error('Failed to resend email');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };


  return (
    <>
      <div className="forgot-message-modal">
        <div className="forgot-message-content">
          <span className="forgot-close" onClick={onClose}>&times;</span>
          <div className="imageHeader">
            <img src={Logo} alt='Logo' className='imageHeaderLogo' />
          </div>
          <div className="forgotPassHeaderContainer">
            <div className="forgotPassMsgHeader">
              <FontAwesomeIcon icon={faEnvelope} className="mail-icon" />
              <div className="forgotPassMsgTitle"> Check your Email </div>
            </div>
            <div className="forgotPassMsgText"> Please check your email {email} for instructions to reset your password </div>
            <div className="forgotSubmit-container">
              <button
                className='forgotSubmit'
                onClick={resendEmail}
              > Resend Email
              </button>
            </div>
            <div className="forgotPassMsg"> Did not receive it yet, click the button to resend it </div>
          </div>
          <div className='footer'>
            <a href=''> Terms of use </a>
            |
            <a href=''> Privacy Policy </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Forgotpassmessage;
