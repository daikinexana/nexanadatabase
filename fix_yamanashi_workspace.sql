-- YAMANASHIのLocation IDを取得
SELECT id, slug, country, city 
FROM locations 
WHERE slug = 'YAMANASHI' AND is_active = true;

-- 上記で取得したLocation IDを使用して、CINOVA YAMANASHIのlocationIdを更新
-- まず、CINOVA YAMANASHIのワークスペースIDを確認
SELECT id, name, country, city, location_id, is_active
FROM workspaces
WHERE name LIKE '%CINOVA%' OR name LIKE '%YAMANASHI%'
ORDER BY created_at DESC;

-- 上記で取得したLocation IDとWorkspace IDを使用して更新
-- 例: UPDATE workspaces SET location_id = 'YAMANASHIのLocation ID' WHERE id = 'CINOVA YAMANASHIのWorkspace ID';

-- または、名前で直接更新（より安全）
UPDATE workspaces 
SET location_id = (
  SELECT id FROM locations WHERE slug = 'YAMANASHI' AND is_active = true LIMIT 1
)
WHERE name = 'CINOVA YAMANASHI'
  AND country = '日本'
  AND city LIKE '%山梨%'
  AND is_active = true;

-- 更新結果を確認
SELECT 
  w.id,
  w.name,
  w.country,
  w.city,
  w.location_id,
  w.is_active,
  l.slug as location_slug,
  l.city as location_city
FROM workspaces w
LEFT JOIN locations l ON w.location_id = l.id
WHERE w.name = 'CINOVA YAMANASHI'
  AND w.is_active = true;

