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

    // "Other" (ID: 6) は削除不可
    if (id === '6') {
      return new Response(JSON.stringify({ error: 'Cannot delete "Other" category' }), {
        status: 400,
      });
    }

    const db = getDrizzle(locals.runtime.env.DB);

    // 関連する支出があるか確認
    const relatedExpenses = await db
      .select({ id: expenses.id })
      .from(expenses)
      .where(eq(expenses.categoryId, id))
      .limit(1);

    if (relatedExpenses.length > 0) {
      // 代替カテゴリを探す (まず ID: 6 (Other) を優先)
      let fallbackCategory = await db.select().from(categories).where(eq(categories.id, '6')).get();

      // ID: 6 がない場合、名前で探す
      if (!fallbackCategory) {
        const otherCats = await db.select().from(categories).where(ne(categories.id, id));

        fallbackCategory = otherCats.find(
          (c) =>
            c.name === 'Other' || c.name === 'Others' || c.name === 'その他' || c.name === 'Unknown'
        );

        // それでもなければ最初の1つ
        if (!fallbackCategory && otherCats.length > 0) {
          fallbackCategory = otherCats[0];
        }
      }

      if (!fallbackCategory) {
        return new Response(
          JSON.stringify({ error: 'Cannot delete the last category with expenses' }),
          { status: 400 }
        );
      }

      // 支出のカテゴリを付け替え
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
