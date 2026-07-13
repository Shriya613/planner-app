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

  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  async function toggleDone(itemId: number, done: boolean) {
    await db.items.update(itemId, { done: !done })
  }

  async function deleteItem(itemId: number) {
    await db.items.delete(itemId)
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

  function startEditing(itemId: number, currentContent: string) {
    setEditingItemId(itemId)
    setEditingContent(currentContent)
  }

  async function saveEdit() {
    if (editingItemId === null) return

    const trimmed = editingContent.trim()
    if (trimmed) {
      await db.items.update(editingItemId, { content: trimmed })
    }

    setEditingItemId(null)
    setEditingContent('')
  }

  function cancelEdit() {
    setEditingItemId(null)
    setEditingContent('')
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
                <button
                  type="button"
                  className="delete-item-button"
                  onClick={() => deleteItem(item.id)}
                  aria-label="Delete item"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
          <p>Done: {doneCount}</p>
        </>
      )}

      {category.type === 'notes' && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {editingItemId === item.id ? (
                <input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  autoFocus
                />
              ) : (
                <span className="editable-text" onClick={() => startEditing(item.id, item.content)}>{item.content}</span>
              )}
              <button
                type="button"
                className="delete-item-button"
                onClick={() => deleteItem(item.id)}
                aria-label="Delete item"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}

      {category.type === 'journal' && items.length > 0 && (
        <div className="journal-page">
          {items.map((item) => (
            <p key={item.id} className="journal-entry">
              {editingItemId === item.id ? (
                <input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  autoFocus
                />
              ) : (
                <span className="editable-text" onClick={() => startEditing(item.id, item.content)}>{item.content}</span>
              )}
              <button
                type="button"
                className="delete-item-button"
                onClick={() => deleteItem(item.id)}
                aria-label="Delete item"
              >
                🗑
              </button>
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
