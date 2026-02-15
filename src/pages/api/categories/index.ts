import { getDrizzle } from '@/db/drizzle';
import { categories } from '@/db/schema';
import type { APIRoute } from 'astro';
import { v4 as uuidv4 } from 'uuid';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { name, icon, color } = data;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const db = getDrizzle(locals.runtime.env.DB);

    const lastCategories = await db.select({ order: categories.order }).from(categories).all();

    const maxOrder = lastCategories.reduce((max, c) => Math.max(max, c.order), 0);

    await db.insert(categories).values({
      id: uuidv4(),
      name,
      icon: icon || 'HelpCircle',
      color: color || 'bg-gray-100 text-gray-600',
      order: maxOrder + 1,
      isActive: true,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
