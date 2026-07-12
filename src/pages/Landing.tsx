import { useNavigate } from 'react-router-dom'

const QUOTE_OF_THE_DAY = '"The secret of getting ahead is getting started." — Mark Twain'

function Landing() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome back</h1>
      <p>{QUOTE_OF_THE_DAY}</p>
      <button type="button" onClick={() => navigate('/home')}>
        Continue
      </button>
    </div>
  )
}

export default Landing
