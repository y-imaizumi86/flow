import { getDrizzle } from '@/db/drizzle';
import { expenses } from '@/db/schema';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
    }

    const db = getDrizzle(locals.runtime.env.DB);
    await db.delete(expenses).where(eq(expenses.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
    }

    const data = await request.json();
    const { amount, categoryId, memo, date } = data;

    if (amount === undefined && !categoryId && memo === undefined && !date) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
    }

    const db = getDrizzle(locals.runtime.env.DB);

    const updateData: any = {};
    if (amount !== undefined) updateData.amount = parseInt(amount);
    if (categoryId) updateData.categoryId = categoryId;
    if (memo !== undefined) updateData.memo = memo;
    if (date) updateData.date = date;

    await db.update(expenses).set(updateData).where(eq(expenses.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
