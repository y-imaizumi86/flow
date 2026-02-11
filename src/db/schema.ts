import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// カテゴリ
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  order: integer('order').default(0).notNull(),
  isActive: integer('is_active', {
    mode: 'boolean',
  })
    .default(true)
    .notNull(),
});

// 支出
export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  memo: text('memo'),
  date: text('date').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});
