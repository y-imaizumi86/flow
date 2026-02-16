import { getDrizzle } from '@/db/drizzle';
import { categories, expenses } from '@/db/schema';
import type { APIRoute } from 'astro';
import { eq, ne } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  try {
    const { id } = params;
    if (!id) return new Response('ID required', { status: 400 });

    const data = await request.json();
    const { name, icon, color } = data;

    const db = getDrizzle(locals.runtime.env.DB);

    await db
      .update(categories)
      .set({
        name,
        icon,
        color,
      })
      .where(eq(categories.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;
    if (!id) return new Response('Id required', { status: 400 });

    const db = getDrizzle(locals.runtime.env.DB);

    const targetCategory = await db.select().from(categories).where(eq(categories.id, id)).get();

    if (!targetCategory) {
      return new Response('Category not found', { status: 404 });
    }

    const PROTECTED_NAMES = ['その他', 'Other', 'Others'];

    if (PROTECTED_NAMES.includes(targetCategory.name)) {
      return new Response(
        JSON.stringify({ error: `「${targetCategory.name}」カテゴリは削除できません` }),
        { status: 404 }
      );
    }

    const relatedExpenses = await db
      .select({ id: expenses.id })
      .from(expenses)
      .where(eq(expenses.categoryId, id))
      .limit(1);

    if (relatedExpenses.length > 0) {
      let fallbackCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, 'その他'))
        .get();

      if (!fallbackCategory) {
        const allCategories = await db.select().from(categories);
        fallbackCategory = allCategories.find((c) =>
          ['Other', 'Others', 'Unknown'].includes(c.name)
        );
      }

      if (!fallbackCategory) {
        return new Response(
          JSON.stringify({
            error: '移行先の「その他」カテゴリが見つかりません。先に作成してください。',
          }),
          { status: 400 }
        );
      }

      await db
        .update(expenses)
        .set({ categoryId: fallbackCategory.id })
        .where(eq(expenses.categoryId, id));
    }

    await db.delete(categories).where(eq(categories.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
