import Home from './components/home';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Quiz from './components/quizpage';
import Answer from './components/answers';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/ans" element={<Answer />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
