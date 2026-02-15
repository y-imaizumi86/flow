import { getDrizzle } from '@/db/drizzle';
import { categories } from '@/db/schema';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { items } = data; // items: { id: string; order: number }[]

    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }

    const db = getDrizzle(locals.runtime.env.DB);

    // Batch update is ideal, but for now we iterate (D1/Drizzle batch support varies by adapter, safe bet is Promise.all)
    // Actually, D1 supports batch execution via db.batch() if using raw queries or d1-driver,
    // but Drizzle with D1 adapter might support batch().
    // For simplicity and safety with current setup, we'll use Promise.all.
    // Ensure we await all updates.

    const updates = items.map((item: { id: string; order: number }) => {
      return db.update(categories).set({ order: item.order }).where(eq(categories.id, item.id));
    });

    await Promise.all(updates);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
