import { useParams } from 'react-router-dom'

function CategoryDetail() {
  const { id } = useParams()

  return (
    <div>
      <h1>Category {id}</h1>
    </div>
  )
}

export default CategoryDetail
