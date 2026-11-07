-- One published example for development. Run after the migration.
insert into public.exercises
  (id, title, category, difficulty, description, equipment, steps, sketch, status)
values (
  'enkel-enkelmarkering',
  'Enkelmarkering på öppen mark',
  'Markering',
  'Nybörjare',
  'Hunden ser en apport landa och tränar på att komma ihåg var den föll.',
  array['En dummy', 'En medhjälpare som kastar'],
  array['Ställ dig med hunden vid din sida på öppen mark med kort gräs.', 'Be medhjälparen kasta dummyn så att hunden tydligt ser var den landar.', 'Vänta tills hunden är lugn. Ge sedan din apport­signal och ta emot dummyn när hunden kommer tillbaka.'],
  '{"caption":"Medhjälparen kastar åt sidan. Den streckade pilen visar kastet och den heldragna pilen visar hundens väg.","points":[{"x":65,"y":152,"label":"Förare + hund"},{"x":95,"y":38,"label":"Kastare"},{"x":245,"y":38,"label":"Apport"}],"arrows":[{"from":[109,38],"to":[229,38],"dashed":true},{"from":[78,143],"to":[232,48],"dashed":false}]}',
  'published'
)
on conflict (id) do nothing;
