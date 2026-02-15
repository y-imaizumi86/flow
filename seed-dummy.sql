-- Categories (Ensure they exist - using INSERT OR IGNORE)
INSERT OR IGNORE INTO categories (id, name, icon, color, "order", is_active) VALUES
('1', 'Food', 'Utensils', 'bg-orange-100 text-orange-600', 1, 1),
('2', 'Transport', 'TrainFront', 'bg-blue-100 text-blue-600', 2, 1),
('3', 'Daily', 'ShoppingBag', 'bg-green-100 text-green-600', 3, 1),
('4', 'Social', 'Beer', 'bg-pink-100 text-pink-600', 4, 1),
('5', 'Hobby', 'Gamepad2', 'bg-purple-100 text-purple-600', 5, 1),
('6', 'Other', 'MoreHorizontal', 'bg-gray-100 text-gray-600', 6, 1);

-- Expenses
-- Using random UUIDs for IDs
-- Today
INSERT INTO expenses (id, amount, category_id, memo, date, created_at) VALUES
('dummy-1', 1200, '1', 'Lunch at Cafe', date('now'), strftime('%s', 'now')),
('dummy-2', 350, '2', 'Train to work', date('now'), strftime('%s', 'now')),
('dummy-3', 4500, '4', 'Dinner with friends', date('now'), strftime('%s', 'now'));

-- Yesterday
INSERT INTO expenses (id, amount, category_id, memo, date, created_at) VALUES
('dummy-4', 5000, '4', 'Drinking party', date('now', '-1 day'), strftime('%s', 'now')),
('dummy-5', 800, '3', 'Shampoo', date('now', '-1 day'), strftime('%s', 'now')),
('dummy-6', 150, '1', 'Coffee', date('now', '-1 day'), strftime('%s', 'now'));

-- 2 Days ago
INSERT INTO expenses (id, amount, category_id, memo, date, created_at) VALUES
('dummy-7', 15000, '5', 'New Game Software', date('now', '-2 days'), strftime('%s', 'now'));

-- 3 Days ago
INSERT INTO expenses (id, amount, category_id, memo, date, created_at) VALUES
('dummy-8', 600, '1', 'Convenience store bento', date('now', '-3 days'), strftime('%s', 'now')),
('dummy-9', 240, '6', 'Stationery', date('now', '-3 days'), strftime('%s', 'now'));
