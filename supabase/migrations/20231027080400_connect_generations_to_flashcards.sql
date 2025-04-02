-- migration: connect flashcards with generations
-- purpose: add a nullable foreign key column 'generation_id' to the flashcards table, linking flashcards to the corresponding generation record in the generations table.
--          For flashcards created manually, 'generation_id' will remain null.
-- affected tables: flashcards
-- dependencies: the generations table must exist with the primary key 'id'
--
-- note: the foreign key constraint is configured to cascade updates and set null on delete,
--       ensuring that if a generation record is deleted, the corresponding flashcards will have their 'generation_id' set to null.

alter table flashcards
  add column generation_id bigint;

alter table flashcards
  add constraint flashcards_generation_id_fkey
    foreign key (generation_id)
      references generations (id)
      on update cascade
      on delete set null;

-- create an index on generation_id for faster lookups when filtering flashcards by generation
create index if not exists flashcards_generation_id_idx
  on flashcards (generation_id);