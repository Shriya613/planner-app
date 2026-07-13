import { useState, type CSSProperties } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { CATEGORY_TYPE_ICONS } from '../db'
import './CategoryDetail.css'

// Fixed points around a circle, so each confetti piece flies a different direction —
// no randomness needed, which keeps the animation deterministic and cheap to render.
const CONFETTI_PIECES = [
  { dx: 40, dy: 0, icon: '❤️' },
  { dx: 28, dy: -28, icon: '✨' },
  { dx: 0, dy: -40, icon: '🎉' },
  { dx: -28, dy: -28, icon: '❤️' },
  { dx: -40, dy: 0, icon: '✨' },
  { dx: -28, dy: 28, icon: '🎉' },
  { dx: 0, dy: 40, icon: '❤️' },
  { dx: 28, dy: 28, icon: '✨' },
]

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

  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const [burstItemId, setBurstItemId] = useState<number | null>(null)

  async function toggleDone(itemId: number, done: boolean) {
    const nowDone = !done
    await db.items.update(itemId, { done: nowDone })

    if (nowDone) {
      setBurstItemId(itemId)
      window.setTimeout(() => {
        setBurstItemId((current) => (current === itemId ? null : current))
      }, 700)
    }
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

  function startRenaming(currentName: string) {
    setRenameValue(currentName)
    setIsRenaming(true)
  }

  async function saveRename() {
    const trimmed = renameValue.trim()
    if (trimmed) {
      await db.categories.update(categoryId, { name: trimmed })
    }
    setIsRenaming(false)
  }

  function cancelRename() {
    setIsRenaming(false)
  }

  async function handleDeleteCategory() {
    // Delete the category and all of its items together in one transaction, so a failure
    // partway through can't leave orphaned items behind or a category with no items table entries.
    await db.transaction('rw', db.categories, db.items, async () => {
      await db.items.where('categoryId').equals(categoryId).delete()
      await db.categories.delete(categoryId)
    })
    navigate('/home')
  }

  if (category === undefined || items === undefined) {
    return <div className="page">Loading…</div>
  }

  if (!category) {
    return (
      <div className="page">
        <button type="button" className="button-secondary" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <p>Category not found.</p>
      </div>
    )
  }

  const doneCount = items.filter((item) => item.done).length

  return (
    <div className="page">
      <button
        type="button"
        className="button-secondary back-button"
        onClick={() => navigate('/home')}
      >
        ← Back
      </button>

      {isRenaming ? (
        <div className="rename-form">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveRename()
              if (e.key === 'Escape') cancelRename()
            }}
            autoFocus
          />
          <button type="button" onClick={saveRename}>
            Save
          </button>
          <button type="button" className="button-secondary" onClick={cancelRename}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="category-header">
          <span className={`category-type-icon category-type-icon--${category.type}`}>
            {CATEGORY_TYPE_ICONS[category.type]}
          </span>
          <h1>{category.name}</h1>
          <button
            type="button"
            className="icon-button"
            onClick={() => startRenaming(category.name)}
            aria-label="Rename category"
          >
            ✏️
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsConfirmingDelete(true)}
            aria-label="Delete category"
          >
            🗑
          </button>
        </div>
      )}

      {isConfirmingDelete && (
        <div className="delete-confirm">
          <p>
            Delete "{category.name}" and all {items.length} item{items.length === 1 ? '' : 's'} in
            it? This can't be undone.
          </p>
          <div className="delete-confirm-actions">
            <button type="button" className="button-danger" onClick={handleDeleteCategory}>
              Delete
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 && <p className="empty-state">Nothing here yet.</p>}

      {category.type === 'checklist' && items.length > 0 && (
        <>
          <ul className="checklist">
            {items.map((item) => (
              <li key={item.id} className="checklist-item">
                <label>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(item.id, item.done)}
                  />
                  <span className={item.done ? 'done-text' : undefined}>{item.content}</span>
                </label>
                {burstItemId === item.id && (
                  <span className="confetti-burst" aria-hidden="true">
                    {CONFETTI_PIECES.map((piece, index) => (
                      <span
                        key={index}
                        className="confetti-piece"
                        style={
                          { '--dx': `${piece.dx}px`, '--dy': `${piece.dy}px` } as CSSProperties
                        }
                      >
                        {piece.icon}
                      </span>
                    ))}
                  </span>
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
          <p className="done-count">Done: {doneCount}</p>
        </>
      )}

      {category.type === 'notes' && items.length > 0 && (
        <ul className="notes-list">
          {items.map((item) => (
            <li key={item.id}>
              {editingItemId === item.id ? (
                <input
                  type="text"
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
                  type="text"
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
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddItem()
              if (e.key === 'Escape') setIsAdding(false)
            }}
            placeholder="Add an item"
            autoFocus
          />
          <button type="button" onClick={handleAddItem}>
            Save
          </button>
          <button type="button" className="button-secondary" onClick={() => setIsAdding(false)}>
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
