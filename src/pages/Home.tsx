import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { type CategoryType } from '../db'

const AFFIRMATION = "You're doing better than you think."

const TYPE_ICONS: Record<CategoryType, string> = {
  checklist: '☑️',
  notes: '📝',
  journal: '📔',
}

function Home() {
  const navigate = useNavigate()
  const categories = useLiveQuery(() => db.categories.toArray())

  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('checklist')

  async function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) return

    await db.categories.add({ name: trimmedName, type })

    setName('')
    setType('checklist')
    setIsAdding(false)
  }

  return (
    <div>
      <div>{AFFIRMATION}</div>

      <ul>
        {categories?.map((category) => (
          <li key={category.id}>
            <button type="button" onClick={() => navigate(`/category/${category.id}`)}>
              <span>{TYPE_ICONS[category.type]}</span> <span>{category.name}</span>
            </button>
          </li>
        ))}

        <li>
          {isAdding ? (
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                autoFocus
              />
              <select value={type} onChange={(e) => setType(e.target.value as CategoryType)}>
                <option value="checklist">Checklist</option>
                <option value="notes">Notes</option>
                <option value="journal">Journal</option>
              </select>
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsAdding(true)}>
              + Add category (custom)
            </button>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Home
