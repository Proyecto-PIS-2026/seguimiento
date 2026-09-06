BEGIN;
UPDATE publications SET actor_id = 'frutas-del-norte' WHERE actor_id = 'demo-operator';
UPDATE market_settings SET actor_id = 'frutas-del-norte' WHERE actor_id = 'demo-operator';
UPDATE sessions SET actor_id = 'frutas-del-norte' WHERE actor_id = 'demo-operator';
UPDATE market_settings
SET vacation = jsonb_set(vacation, '{substitute,id}', '"frutas-del-norte"'::jsonb)
WHERE vacation #>> '{substitute,id}' = 'demo-operator';
COMMIT;
