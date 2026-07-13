import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db'
import './CategoryDetail.css'

function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categoryId = Number(id)

  // Live queries only see writes made through this Dexie instance (e.g. db.items.add/.update) —
  // writes via the raw IndexedDB API won't trigger a re-render here.
  const category = useLiveQuery(() => db.categories.get(categoryId), [categoryId])
  const items = useLiveQuery(
    () => db.items.where('categoryId').equals(categoryId).toArray(),
    [categoryId],
  )

  const [isAdding, setIsAdding] = useState(false)
  const [content, setContent] = useState('')

  async function toggleDone(itemId: number, done: boolean) {
    await db.items.update(itemId, { done: !done })
  }

  async function handleAddItem() {
    const trimmed = content.trim()
    if (!trimmed) return

    await db.items.add({
      categoryId,
      content: trimmed,
      done: false,
      createdAt: Date.now(),
    })

    setContent('')
    setIsAdding(false)
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

      {isAdding ? (
        <div className="add-item-sheet">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add an item"
            autoFocus
          />
          <button type="button" onClick={handleAddItem}>
            Save
          </button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" className="add-item-button" onClick={() => setIsAdding(true)}>
          +
        </button>
      )}
    </div>
  )
}

export default CategoryDetail
