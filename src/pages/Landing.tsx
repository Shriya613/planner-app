import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageTransition, pageVariants } from '../motion'
import './Landing.css'

const QUOTE_OF_THE_DAY = '"The secret of getting ahead is getting started." — Mark Twain'

function Landing() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="landing-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1>Welcome back</h1>
      <p className="quote">{QUOTE_OF_THE_DAY}</p>
      <button type="button" onClick={() => navigate('/home')}>
        Continue
      </button>
    </motion.div>
  )
}

export default Landing
