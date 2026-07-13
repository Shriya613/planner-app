import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { CATEGORY_TYPE_ICONS, type CategoryType } from '../db'
import './Home.css'

const AFFIRMATION = "You're doing better than you think."

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
    <div className="home-page">
      <div className="affirmation-banner">{AFFIRMATION}</div>

      <ul className="category-list">
        {categories?.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={`category-card category-card--${category.type}`}
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <span className="category-card-icon">{CATEGORY_TYPE_ICONS[category.type]}</span>
              <span className="category-card-name">{category.name}</span>
            </button>
          </li>
        ))}

        <li>
          {isAdding ? (
            <div className="add-category-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setIsAdding(false)
                }}
                placeholder="Category name"
                autoFocus
              />
              <select value={type} onChange={(e) => setType(e.target.value as CategoryType)}>
                <option value="checklist">Checklist</option>
                <option value="notes">Notes</option>
                <option value="journal">Journal</option>
              </select>
              <div className="add-category-form-actions">
                <button type="button" onClick={handleSave}>
                  Save
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="add-category-button"
              onClick={() => setIsAdding(true)}
            >
              + Add category (custom)
            </button>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Home
