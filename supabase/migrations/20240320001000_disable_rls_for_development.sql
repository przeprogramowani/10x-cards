-- migration: disable rls for development
-- purpose: temporarily disable row level security on all tables for development purposes
-- affected tables: flashcards, generations, generation_error_logs
-- warning: this is for development only and should not be used in production
--         re-enable rls before deploying to production

-- disable rls on flashcards table
alter table flashcards disable row level security;

-- disable rls on generations table
alter table generations disable row level security;

-- disable rls on generation_error_logs table
alter table generation_error_logs disable row level security;

comment on table flashcards is 'WARNING: RLS disabled for development - DO NOT USE IN PRODUCTION';
comment on table generations is 'WARNING: RLS disabled for development - DO NOT USE IN PRODUCTION';
comment on table generation_error_logs is 'WARNING: RLS disabled for development - DO NOT USE IN PRODUCTION';