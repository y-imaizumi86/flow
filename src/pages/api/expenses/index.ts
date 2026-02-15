import { getDrizzle } from '@/db/drizzle';
import { expenses } from '@/db/schema';
import type { APIRoute } from 'astro';
import { v4 as uuidv4 } from 'uuid';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { amount, categoryId, memo, date } = data;

    if (!amount || !categoryId || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const db = getDrizzle(locals.runtime.env.DB);

    await db.insert(expenses).values({
      id: uuidv4(),
      amount: parseInt(amount),
      categoryId,
      memo: memo || '',
      date,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
