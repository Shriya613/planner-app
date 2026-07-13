import { useNavigate } from 'react-router-dom'
import './Landing.css'

const QUOTE_OF_THE_DAY = '"The secret of getting ahead is getting started." — Mark Twain'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <h1>Welcome back</h1>
      <p className="quote">{QUOTE_OF_THE_DAY}</p>
      <button type="button" onClick={() => navigate('/home')}>
        Continue
      </button>
    </div>
  )
}

export default Landing
