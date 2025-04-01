-- Migration: Create flashcards and generation_logs tables
-- Description: Initial schema setup for the flashcards generation system
-- Tables:
--   - flashcards: Stores user-generated and approved flashcards
--   - generation_logs: Tracks AI generation metrics and status

-- Create flashcards table
create table public.flashcards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    front text not null,
    back text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create generation_logs table
create table public.generation_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    input_length integer not null,
    flashcards_count integer not null,
    flashcards_approved_count integer null,
    status text not null,
    response_time integer not null,
    error_message text null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.flashcards enable row level security;
alter table public.generation_logs enable row level security;

-- Create policies for flashcards table
-- Policy for authenticated users to select their own flashcards
create policy "Users can view their own flashcards"
    on public.flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own flashcards
create policy "Users can create their own flashcards"
    on public.flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update their own flashcards
create policy "Users can update their own flashcards"
    on public.flashcards
    for update
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to delete their own flashcards
create policy "Users can delete their own flashcards"
    on public.flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create policies for generation_logs
-- Policy for authenticated users to view their own logs
create policy "Users can view their own generation logs"
    on public.generation_logs
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own logs
create policy "Users can insert their own generation logs"
    on public.generation_logs
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update approved count of their logs
create policy "Users can update approved count of their logs"
    on public.generation_logs
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (
        auth.uid() = user_id
        and flashcards_approved_count is not null
        -- Only allow updating the approved count
        and (
            old.input_length = new.input_length
            and old.flashcards_count = new.flashcards_count
            and old.status = new.status
            and old.response_time = new.response_time
            and old.error_message is not distinct from new.error_message
        )
    );

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for flashcards updated_at
create trigger handle_flashcards_updated_at
    before update on public.flashcards
    for each row
    execute function public.handle_updated_at();

-- Add helpful comments
comment on table public.flashcards is 'Stores user-generated and approved flashcards';
comment on table public.generation_logs is 'Tracks AI generation metrics and status';