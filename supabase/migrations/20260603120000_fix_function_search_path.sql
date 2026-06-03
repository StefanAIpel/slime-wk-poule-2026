-- Security: zet een vaste search_path op de trigger-functie (advisor-warning
-- function_search_path_mutable).
alter function app.set_updated_at() set search_path = '';
