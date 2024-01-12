import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state/index';

const Home = () => {
  // State to manage user's email input and button click status
  const [email, setEmail] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false); // State to track button click

  // React Router navigation hook
  const navigate = useNavigate();

  // Redux dispatch function
  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() !== '') {
      // Dispatch action to set user login state
      dispatch(
        setLogin({
          user: email,
        })
      );

      console.log('Logged in');

      // Enter fullscreen mode
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      // Set button click state to true and navigate to the quiz page
      setButtonClicked(true);
      navigate('/quiz');
    } else {
      console.log('Please enter your email before starting.');
    }
  };

  // Effect to handle exit from fullscreen mode
  useEffect(() => {
    const exitFullscreenHandler = () => {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // Navigate to the home page when exiting fullscreen
        navigate('/');
      }
    };

    // Add event listeners for fullscreen change
    document.addEventListener('fullscreenchange', exitFullscreenHandler);
    document.addEventListener('mozfullscreenchange', exitFullscreenHandler);
    document.addEventListener('webkitfullscreenchange', exitFullscreenHandler);
    document.addEventListener('msfullscreenchange', exitFullscreenHandler);

    // Remove event listeners when the component is unmounted
    return () => {
      document.removeEventListener('fullscreenchange', exitFullscreenHandler);
      document.removeEventListener('mozfullscreenchange', exitFullscreenHandler);
      document.removeEventListener('webkitfullscreenchange', exitFullscreenHandler);
      document.removeEventListener('msfullscreenchange', exitFullscreenHandler);
    };
  }, [navigate]);

  return (
    <div>
      <div className="box">
        <div className="col3">
          <form onSubmit={handleSubmit}>
            <div className='col4'>
              {/* Header */}
              <div className='headline'>QuizMaster: Test Your Knowledge!</div>

              {/* User email input */}
              <input
                className="emailIn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
                required
              />

              {/* Submit button with dynamic styles based on click status */}
              <button
                className={`submit ${buttonClicked ? 'clicked' : ''}`} // Apply 'clicked' class when button is clicked
                type="submit"
                style={{ backgroundColor: buttonClicked ? '#24cb3d' : '#007BFD' }} // Change color dynamically
              >
                Let's Start
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
