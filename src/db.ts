import Dexie, { type EntityTable } from 'dexie'

export type CategoryType = 'checklist' | 'notes' | 'journal'

export interface Category {
  id: number
  name: string
  type: CategoryType
}

export interface Item {
  id: number
  categoryId: number
  content: string
  done: boolean
  createdAt: number
}

const db = new Dexie('PlannerDatabase') as Dexie & {
  categories: EntityTable<Category, 'id'>
  items: EntityTable<Item, 'id'>
}

db.version(1).stores({
  categories: '++id, name, type',
  items: '++id, categoryId, createdAt',
})

const STARTER_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'To-do', type: 'checklist' },
  { name: 'Quick ideas', type: 'notes' },
  { name: 'Quotes', type: 'notes' },
  { name: 'TBR list', type: 'journal' },
]

export async function seedCategoriesIfEmpty() {
  await db.transaction('rw', db.categories, async () => {
    const count = await db.categories.count()
    if (count === 0) {
      await db.categories.bulkAdd(STARTER_CATEGORIES)
    }
  })
}

export default db
