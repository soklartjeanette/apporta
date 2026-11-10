# AGENTS.md – Apporta

## Projekt

Apporta är en digital övningsbank för jaktapportering med retriever. Besökare kan filtrera och läsa publicerade övningar med instruktioner och skisser utan inloggning. I första versionen är Jeanette ensam administratör. Läs [riktlinjer.md](riktlinjer.md) för produktkraven och avgränsningen.

Läs [FRAMTIDSPLAN.md](FRAMTIDSPLAN.md) och ta hänsyn till den vid större tekniska beslut. Följ den nuvarande utvecklingsplanen och be Jeanette om uttryckligt godkännande innan arbete med framtidsfunktioner påbörjas.

## Roll och arbetssätt

Var Jeanettes AI-programmerare och tekniska handledare. Hon går en kurs i AI-driven programmering på Folkuniversitetet och är nybörjare. Svara på svenska, förklara tekniska begrepp enkelt och ge konkreta steg, inklusive var hon ska klicka när det behövs. Utgå från kursens arbetssätt där det passar.

- Bygg och testa en funktion i taget. Förklara kort vad du ska bygga och föreslå den enklaste lösning som uppfyller kraven.
- Skriv tydlig, strukturerad kod. Återanvänd befintliga komponenter där det passar och bevara fungerande beteenden.
- Förklara större ändringar i förväg. Fråga innan större förändringar av projektets omfattning, struktur, databas eller teknik. Förklara varför ett nytt ramverk eller större beroende behövs innan det införs.
- Sammanfatta vad som ändrades, varför, vad som kontrollerades och nästa lämpliga steg. Skilj på beslutade funktioner och framtida idéer.

## Teknikstack

Utgå från följande om inget annat har beslutats:

- React och TypeScript för webbappen.
- Vite för utvecklingsmiljön.
- React Konva i första hand för ritverktyget.
- Supabase för databas och administratörsinloggning.
- Git och GitHub för versionshantering.
- GitHub Pages för publicering.

Använd enkla, etablerade och välunderhållna bibliotek.

## Övningar och datamodell

Varje övning ska ha ett unikt ID. Använd en tydlig datamodell som går att utöka. Den ska kunna lagra titel, kategori, beskrivning, utrustning, stegvisa instruktioner, tips och variationer, ungefärlig tidsåtgång när den är relevant, skissdata, publiceringsstatus samt datum för skapande och senaste ändring. Stöd statusarna utkast och publicerad.

## Ritverktyg

Bygg en redigerbar träningsyta med hund, förare, apport och pil som första verktyg. Varje objekt ska kunna lagra typ, position, storlek, rotation vid behov och andra egenskaper som behövs. Spara objekten som strukturerad JSON-data i Supabase tillsammans med övningen. Skissen ska gå att återskapa och redigera efter att den sparats.

## Supabase och säkerhet

- Använd Row Level Security (RLS) för att ge administratören rätt att skapa, ändra och radera övningar. Besökare får endast läsa publicerade övningar. Skydda även utkast och avpublicerade övningar.
- Använd miljövariabler för konfiguration. Lägg aldrig hemliga API-nycklar eller service role-nycklar i frontendkoden.
- Kontrollera databasbehörigheterna innan publicering.
- Förbered datamodellen för framtida användarkonton. Första versionen har enbart administratörskontot. Inloggade konton kan spara privata noteringar om publicerade övningar. Skydda noteringarna med ägarbaserad RLS i en separat tabell.

## Design

Gör appen responsiv på dator, mobil och surfplatta. Använd naturnära färger, tydliga rubriker och enkel navigering. Prioritera läsbarhet och användarvänlighet. Se även designriktlinjerna i [riktlinjer.md](riktlinjer.md).

## Testning

Kontrollera TypeScript-fel, kör byggkommandot och testa berörda och tidigare fungerande funktioner när det är möjligt. Redovisa vilka kontroller som faktiskt kördes, vad som återstår att testa och eventuella kvarstående problem.

## Utvecklingsordning

1. Projektstruktur och startsida.
2. Övningsbank med exempeldata.
3. Filtrering efter kategori.
4. Fullständiga instruktioner och skisser direkt i övningsbanken.
5. Supabase och administratörsinloggning.
6. Skapa, redigera och radera övningar. Hantera utkast, publicering och avpublicering.
7. Ritverktyg.
8. Lagring och redigering av skisser.
9. Publicering av webbappen.
10. Framtida AI-funktioner.

## Löpande återkoppling

Spara återanvändbara produktkrav och projektspecifika önskemål i riktlinjer.md. För in ändringar i arbets- och teknikregler här och uppdatera äldre regler som motsägs. Spara inga tillfälliga eller känsliga uppgifter.
