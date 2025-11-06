-- 1. YAMANASHIのLocation IDを確認
SELECT id, slug, country, city 
FROM locations 
WHERE slug = 'YAMANASHI' AND is_active = true;

-- 2. 山梨県のワークスペースを確認（locationIdが設定されているか）
SELECT 
  w.id,
  w.name,
  w.country,
  w.city,
  w.location_id,
  w.is_active,
  l.slug as location_slug
FROM workspaces w
LEFT JOIN locations l ON w.location_id = l.id
WHERE w.country = '日本' AND w.city LIKE '%山梨%'
ORDER BY w.created_at DESC;

-- 3. locationIdがNULLのワークスペースを確認
SELECT 
  w.id,
  w.name,
  w.country,
  w.city,
  w.location_id,
  w.is_active
FROM workspaces w
WHERE w.country = '日本' 
  AND w.city LIKE '%山梨%'
  AND w.location_id IS NULL
  AND w.is_active = true;

-- 4. YAMANASHIのLocationに紐付いているワークスペースを確認
SELECT 
  w.id,
  w.name,
  w.country,
  w.city,
  w.is_active,
  l.slug as location_slug
FROM workspaces w
INNER JOIN locations l ON w.location_id = l.id
WHERE l.slug = 'YAMANASHI'
  AND w.is_active = true;

-- 5. ワークスペースのlocationIdを更新する例（YAMANASHIのLocation IDを取得してから実行）
-- まず、YAMANASHIのLocation IDを取得
-- SELECT id FROM locations WHERE slug = 'YAMANASHI';

-- その後、ワークスペースのlocationIdを更新（例）
-- UPDATE workspaces 
-- SET location_id = 'YAMANASHIのLocation IDをここに貼り付け'
-- WHERE country = '日本' 
--   AND city LIKE '%山梨%'
--   AND location_id IS NULL
--   AND is_active = true;

