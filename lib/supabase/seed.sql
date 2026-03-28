-- Seed spaces with curated palettes and default sound configs
insert into public.spaces (id, name, category, wallpaper_path, palette_json, default_sounds_json, companion_theme) values
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Rainy Library',
  'cozy',
  '/wallpapers/rainy-library.jpg',
  '{"bg_primary":"#14130e","bg_secondary":"#1e1c16","accent":"#d4943a","accent_hover":"#e8a32e","text_primary":"#e8e0d0","text_secondary":"#8a7a5e","border":"#3a3428","surface":"#2a2620"}',
  '[{"track_id":"rain","volume":0.6,"enabled":true},{"track_id":"fire","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Ocean Cabin',
  'nature',
  '/wallpapers/ocean-cabin.jpg',
  '{"bg_primary":"#0e1419","bg_secondary":"#141d24","accent":"#4a9bb5","accent_hover":"#5eb8d4","text_primary":"#d4e4ec","text_secondary":"#6a8a9e","border":"#243440","surface":"#1a2830"}',
  '[{"track_id":"waves","volume":0.7,"enabled":true},{"track_id":"forest","volume":0.2,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Mountain Lodge',
  'cozy',
  '/wallpapers/mountain-lodge.jpg',
  '{"bg_primary":"#16130f","bg_secondary":"#201c16","accent":"#c27a3a","accent_hover":"#d98f4e","text_primary":"#e8ddd0","text_secondary":"#8a755e","border":"#3a3020","surface":"#2a2418"}',
  '[{"track_id":"fire","volume":0.6,"enabled":true},{"track_id":"rain","volume":0.2,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Zen Garden',
  'nature',
  '/wallpapers/zen-garden.jpg',
  '{"bg_primary":"#0e1410","bg_secondary":"#141e16","accent":"#5a9b6b","accent_hover":"#6bb87e","text_primary":"#d4e8da","text_secondary":"#6a9a7a","border":"#243a2a","surface":"#1a2e20"}',
  '[{"track_id":"forest","volume":0.5,"enabled":true},{"track_id":"delta","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Sunset Desert',
  'ambient',
  '/wallpapers/sunset-desert.jpg',
  '{"bg_primary":"#181210","bg_secondary":"#221a16","accent":"#d46a3a","accent_hover":"#e87e4e","text_primary":"#e8dcd4","text_secondary":"#9a7a6a","border":"#3a2a22","surface":"#2e2018"}',
  '[{"track_id":"fire","volume":0.5,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0006-4000-8000-000000000006',
  'Midnight City',
  'urban',
  '/wallpapers/midnight-city.jpg',
  '{"bg_primary":"#0e0e14","bg_secondary":"#14141e","accent":"#7a6ad4","accent_hover":"#9488e8","text_primary":"#d8d4e8","text_secondary":"#7a7a9a","border":"#2a2a3a","surface":"#1e1e2e"}',
  '[{"track_id":"cafe","volume":0.5,"enabled":true},{"track_id":"rain","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0007-4000-8000-000000000007',
  'Autumn Cafe',
  'cozy',
  '/wallpapers/autumn-cafe.jpg',
  '{"bg_primary":"#16120e","bg_secondary":"#201a14","accent":"#c4843a","accent_hover":"#d8984e","text_primary":"#e8dece","text_secondary":"#8a7a60","border":"#3a3020","surface":"#2a2418"}',
  '[{"track_id":"cafe","volume":0.6,"enabled":true},{"track_id":"rain","volume":0.4,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0008-4000-8000-000000000008',
  'Northern Cabin',
  'cozy',
  '/wallpapers/northern-cabin.jpg',
  '{"bg_primary":"#101416","bg_secondary":"#161e22","accent":"#5a8aaa","accent_hover":"#6ea0c0","text_primary":"#d4dee8","text_secondary":"#6a8090","border":"#243038","surface":"#1a2830"}',
  '[{"track_id":"fire","volume":0.5,"enabled":true},{"track_id":"waves","volume":0.3,"enabled":true}]',
  'default'
);
