import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './index.css';

const UserData = () => {
  // Get user ID from Redux store
  const userId = useSelector((state) => state.user);

  // State to manage user data and loading status
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // React Router navigation hook
  const navigate = useNavigate();

  // Effect to fetch user data when component mounts
  useEffect(() => {
    // Make an API call to fetch user data
    fetch('https://quiz-leyt.onrender.com/email')
      .then((response) => response.json())
      .then((data) => {
        // Find user data based on user ID
        const foundUser = data.find((user) => user.user === userId);

        // If user data is found, update the state
        if (foundUser) {
          setUserData(foundUser);
        }

        // Set loading state to false
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);

        // Set loading state to false in case of an error
        setLoading(false);
      });
  }, [userId]);

  // Function to navigate back to the home page
  const redirectToHome = () => {
    navigate('../'); // Specify the correct path to your home page
  };

  return (
    <div>
      {/* Button to exit and go back to the home page */}
      <button onClick={redirectToHome} className="home-button">
        Exit
      </button>

      {/* Display loading message while fetching user data */}
      {loading ? (
        <button onClick={redirectToHome}>Loading your results...🤗</button>
      ) : userData ? (
        // Display user data if available
        <div>
          {userData.data.map((question) => (
            <div key={question.id} className="question">
              {/* Display attempt status */}
              <p className={userData.selectedOptions[question.id - 1] === null ? 'ntatt' : 'att'}>
                {userData.selectedOptions[question.id - 1] === null ? 'Not Attempted' : 'Attempted'}
              </p>

              {/* Display question */}
              <p>{question.question}</p>

              {/* Display options with different background colors based on correctness */}
              {question.options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: option === question.correct_answer ? 'green' : option === userData.selectedOptions[question.id - 1] ? 'red' : 'white',
                    padding: '1.2rem',
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        // Display message if user data is not found
        <button onClick={redirectToHome}>User data not found. Go to Home</button>
      )}
    </div>
  );
};

export default UserData;
