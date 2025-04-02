-- 20231016120000_create_flashcards_generations_errorlogs.sql
-- purpose: create flashcards, generations, and generation_error_logs tables with constraints, indexes, and row level security policies for both anon and authenticated roles.
-- affected tables: flashcards, generations, generation_error_logs.
--
-- this migration creates the tables according to the db-plan, including necessary check constraints and foreign keys.
-- row level security is enabled on all tables with separate policies for select, insert, update, and delete for the roles 'anon' and 'authenticated'.

begin;

-- create flashcards table
create table flashcards (
  id bigserial primary key,
  user_id uuid not null,
  question varchar(200) not null,
  answer varchar(500) not null,
  source varchar not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint flashcards_question_length check (char_length(question) <= 200),
  constraint flashcards_answer_length check (char_length(answer) <= 500),
  constraint flashcards_source_enum check (source in ('manual','ai-full','ai-edited'))
);

-- add foreign key constraint assuming auth.users table has column user_id
alter table flashcards
  add constraint fk_flashcards_user foreign key (user_id) references auth.users(id);

-- create indexes for flashcards
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_created_at on flashcards(created_at);

-- enable row level security for flashcards
alter table flashcards enable row level security;

-- rls policies for flashcards (select)
create policy select_own_flashcards_authenticated on flashcards
  for select
  to authenticated
  using (auth.uid() = user_id);

-- rls policies for flashcards (insert)
create policy insert_own_flashcards_authenticated on flashcards
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- rls policies for flashcards (update)
create policy update_own_flashcards_authenticated on flashcards
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- rls policies for flashcards (delete)
create policy delete_own_flashcards_authenticated on flashcards
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- create generations table
create table generations (
  id bigserial primary key,
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  model_type varchar not null,
  number_of_suggestions integer not null,
  source_text_hash varchar not null,
  source_text_length integer not null,
  generation_time integer not null,
  accepted_flashcards_unedited integer,
  accepted_flashcards_edited integer,
  foreign key (user_id) references auth.users(id)
);

-- create indexes for generations
create index idx_generations_user_id on generations(user_id);
create index idx_generations_created_at on generations(created_at);

-- enable row level security for generations
alter table generations enable row level security;

-- rls policies for generations (select)
create policy select_own_generations_authenticated on generations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- rls policies for generations (insert)
create policy insert_own_generations_authenticated on generations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- rls policies for generations (update)
create policy update_own_generations_authenticated on generations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- rls policies for generations (delete)
create policy delete_own_generations_authenticated on generations
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- create generation_error_logs table
create table generation_error_logs (
  id bigserial primary key,
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  model_type varchar not null,
  source_text_hash varchar not null,
  source_text_length integer not null,
  generation_time integer not null,
  error_code varchar not null,
  error_message text not null,
  foreign key (user_id) references auth.users(id)
);

-- create indexes for generation_error_logs
create index idx_generation_error_logs_user_id on generation_error_logs(user_id);
create index idx_generation_error_logs_created_at on generation_error_logs(created_at);

-- enable row level security for generation_error_logs
alter table generation_error_logs enable row level security;

-- rls policies for generation_error_logs (select)
create policy select_own_generation_error_logs_authenticated on generation_error_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

-- rls policies for generation_error_logs (insert)
create policy insert_own_generation_error_logs_authenticated on generation_error_logs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- rls policies for generation_error_logs (update)
create policy update_own_generation_error_logs_authenticated on generation_error_logs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- rls policies for generation_error_logs (delete)
create policy delete_own_generation_error_logs_authenticated on generation_error_logs
  for delete
  to authenticated
  using (auth.uid() = user_id);

commit;