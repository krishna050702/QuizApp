import React, { useEffect, useState } from 'react';
import './index.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  // State for storing quiz data, current question index, visited questions, selected options, timer, and user ID
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(Array(15).fill(false));
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timer, setTimer] = useState(30 * 60); // 30 minutes timer
  const userId = useSelector((state) => state.user); // Redux state for user ID
  const navigate = useNavigate(); // Function for programmatic navigation

  // useEffect to fetch quiz data when userId changes
  useEffect(() => {
    const apiUrl = 'https://opentdb.com/api.php?amount=15';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Process the fetched data to include question IDs and options
        const questionsWithId = data.results.map((question, index) => ({
          ...question,
          id: index + 1,
          options: [...question.incorrect_answers, question.correct_answer],
        }));
        setQuizData(questionsWithId);

        // Mark the first question as visited
        const updatedVisitedQuestions = [...visitedQuestions];
        updatedVisitedQuestions[0] = true;
        setVisitedQuestions(updatedVisitedQuestions);

        // Reset the timer to its initial value
        setTimer(30 * 60);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [userId]); // Include userId in the dependency array to reset the timer for each login

  // useEffect for the countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer - 1;
        if (newTimer === 0) {
          handleSubmit(); // Submit the quiz when the timer reaches 0
        }
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [userId]); // Include userId in the dependency array to reset the timer when it changes

  // Calculate minutes and seconds from the timer
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // Count the number of attempted questions
  const attemptedQuestionsCount = selectedOptions.filter((visited) => visited).length;

  // Function to navigate to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      // Mark the next question as visited
      const updatedVisitedQuestions = [...visitedQuestions];
      updatedVisitedQuestions[currentQuestion + 1] = true;
      setVisitedQuestions(updatedVisitedQuestions);
    }
  };

  // Function to navigate to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Function to handle click on the question in the overview section
  const handleOverviewClick = (index) => {
    setCurrentQuestion(index);

    // Mark the clicked question as visited
    const updatedVisitedQuestions = [...visitedQuestions];
    updatedVisitedQuestions[index] = true;
    setVisitedQuestions(updatedVisitedQuestions);
  };

  // Get the data for the current question
  const currentQuestionData = quizData && quizData[currentQuestion];

  // Function to handle a change in the selected option for the current question
  const handleOptionChange = (option) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestion] = option;
    setSelectedOptions(updatedSelectedOptions);
  };

  // Function to clear the selected option for the current question
  const handleClear = () => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestion] = null;
    setSelectedOptions(updatedSelectedOptions);

    // Reset styling (remove 'selected' class)
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
      if (index === currentQuestion) {
        option.classList.remove('selected');
      }
    });
  };

  // Function to submit the quiz
  const handleSubmit = () => {
    const answers = selectedOptions;
    const answeredOptions = selectedOptions.filter((option) => option !== null);

    // Check if all questions are answered
    if (answeredOptions.length !== quizData.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Send user responses to a server and navigate to the answers page
    fetch('https://quiz-leyt.onrender.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        data: quizData,
        selectedOptions: selectedOptions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data updated successfully:', data);
        navigate('/ans'); // Navigate to the answers page
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  // Render the quiz UI
  return (
    <div>
      {quizData && userId != null ? (
        <>
          {/* Navbar section with timer */}
          <div className="navbar">
            <div className="timer">
              Time Left{' '}
              <span className="times">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
            </div>
          </div>

          {/* Main quiz content */}
          <div className="board">
            {/* Left section with the current question */}
            <div className="leftpart">
              <div className="surround">
                <div className="head_ques">Question {currentQuestionData.id}</div>
                <p className="ques">{currentQuestionData.question}</p>
              </div>
              <ul>
                {/* Options for the current question */}
                {currentQuestionData.options.map((option, index) => (
                  <div
                    className={`option ${selectedOptions[currentQuestion] === option ? 'selected' : 'notselected'}`}
                    onClick={() => handleOptionChange(option)}
                    key={index}
                  >
                    {option}
                  </div>
                ))}
              </ul>
              {/* Navigation buttons */}
              <div className="buttons">
                <button
                  className="prev"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  style={{ color: 'red' }}
                >
                  Previous
                </button>
                <button
                  className="clear"
                  onClick={handleClear}
                  disabled={currentQuestion === 0}
                  style={{ color: 'white' }}
                >
                  Clear
                </button>
                <button
                  className="next"
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === quizData.length - 1}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Right section with the overview and submit button */}
            <div className="rightpart">
              <div className="overview">
                {/* Display the number of attempted questions */}
                <h3>{`Questions : ${attemptedQuestionsCount}/15`}</h3>
                {/* Overview grid with question numbers */}
                <div className="question-grid">
                  {visitedQuestions.map((visited, index) => (
                    <div
                      key={index}
                      className={`question-number ${visited ? 'visited' : ''} ${selectedOptions[index] ? 'attempted' : ''}`}
                      onClick={() => handleOverviewClick(index)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
              {/* Submit button */}
              <div className="submit_test">
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Conditional rendering based on quiz data and user authentication
        userId == null ? navigate('/') : <button>Your questions are on the way....</button>
      )}
    </div>
  );
};

export default Quiz;
