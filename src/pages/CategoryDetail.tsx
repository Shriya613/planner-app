import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db'
import './CategoryDetail.css'

function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categoryId = Number(id)

  const category = useLiveQuery(() => db.categories.get(categoryId), [categoryId])
  const items = useLiveQuery(
    () => db.items.where('categoryId').equals(categoryId).toArray(),
    [categoryId],
  )

  async function toggleDone(itemId: number, done: boolean) {
    await db.items.update(itemId, { done: !done })
  }

  if (category === undefined || items === undefined) {
    return <div>Loading…</div>
  }

  if (!category) {
    return (
      <div>
        <button type="button" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <p>Category not found.</p>
      </div>
    )
  }

  const doneCount = items.filter((item) => item.done).length

  return (
    <div>
      <button type="button" onClick={() => navigate('/home')}>
        ← Back
      </button>
      <h1>{category.name}</h1>

      {items.length === 0 && <p>Nothing here yet.</p>}

      {category.type === 'checklist' && items.length > 0 && (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(item.id, item.done)}
                  />
                  <span className={item.done ? 'done-text' : undefined}>{item.content}</span>
                </label>
              </li>
            ))}
          </ul>
          <p>Done: {doneCount}</p>
        </>
      )}

      {category.type === 'notes' && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
      )}

      {category.type === 'journal' && items.length > 0 && (
        <div className="journal-page">
          {items.map((item) => (
            <p key={item.id} className="journal-entry">
              {item.content}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryDetail
