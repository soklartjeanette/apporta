# APPORTERA MERA – PROJEKTRIKTLINJER

## Bakgrund och mål

Jag går en kurs i AI-driven programmering av webbappar på Folkuniversitetet.

Mitt projekt är att utveckla en webbapp för jaktapportering med retriever.

Appens namn är **Apportera mera**. Använd det konsekvent i gränssnitt, sidtitel och dokumentation. **Din digitala övningsbank** kan användas som undertitel.

Prioritera korta namn och webbadresser som faller naturligt i tal och är lätta att komma ihåg efter att ha hört dem en gång.

Överväg **apporteramera.se** som domän inför publicering. Kontrollera tillgängligheten på nytt när det blir aktuellt.

Appen ska samla träningsövningar inom jaktapportering och göra det enkelt att hitta inspiration, förstå hur övningar genomförs och skapa egna övningar med text och skisser.

Målet är att bygga en användarvänlig och professionell webbapp som kan utvecklas till en tjänst för andra retrieverägare, tränare och instruktörer.

## Viktiga grundprinciper

- Appen ska vara en övningsbank, INTE en träningsdagbok.
- Användaren ska inte behöva registrera träningspass, resultat eller utveckling.
- Varje övning ska innehålla både text och en pedagogisk skiss.
- Visa kategori, titel, svårighetsgrad, stegvisa instruktioner och skiss direkt i övningskortet. Utelämna kort beskrivning och separat utrustningsavsnitt. Övningens titel är en rubrik.
- Visa tre övningskort i rad på breda skärmar och färre per rad när utrymmet är begränsat.
- Visa svårighetsgraden som en liten, diskret etikett i övre högra hörnet av varje övningskort.
- Visa instruktioner och skisser direkt i korten utan underrubrikerna ”Gör så här” och ”Skiss”.
- Appen ska vara enkel att använda även för personer utan tekniska kunskaper.
- Den ska fungera på mobil, surfplatta och dator.
- Börja enkelt och bygg ut funktionerna successivt. Använd ett fåtal exempelövningar under utvecklingen och sikta på cirka 20–30 övningar på längre sikt.
- Prioritera kvalitet, användarvänlighet och tydlighet framför många funktioner.

## Användare och behörigheter

I första versionen är jag ensam administratör.

Endast jag ska kunna:
- Skapa nya övningar.
- Redigera befintliga övningar.
- Ändra tillhörande skisser.
- Radera övningar.
- Publicera och avpublicera övningar.

Besökare ska kunna:
- Filtrera bland publicerade övningar på kategori, svårighetsgrad och kast. Använd rubriken ”Övningar med eller utan kast” och valen ”Med kast” och ”Utan kast”.
- Kastfiltret utgår från övningens kategori. Markering samt Dirigering och linjetag hör till ”Med kast”. Ringträning samt Stadga och passivitet hör till ”Utan kast”.
- Läsa instruktioner.
- Se skisser.

Besökare ska inte behöva logga in.

På längre sikt kan appen utvecklas så att andra användare kan skapa och dela egna övningar. Detta ska inte ingå i första versionen.

## Övningar

- Kalla avsnittet och menylänken **Övningar**. Lägg **Alla rutor** och **Mina rutor** i samma rullista och förvälj **Alla rutor**. Förvälj **Med och utan kast**, **Alla kategorier** och **Alla svårighetsgrader** i de publika filtren.
- Ge favorithjärtat en diskret, mindre ring och lämna luft till svårighetsetiketten. Behåll ett tydligt hjärta och en generös tryckyta på mobilen.
- Besökare ska kunna spara valfria publicerade rutor som favoriter genom att trycka på ett hjärta, oavsett vem som har skapat övningen. Ett fyllt hjärta visar att rutan är sparad. Tryck igen för att ta bort favoriten.
- **Mina rutor** visar besökarens sparade, publicerade rutor. Favoriter sparas i den aktuella webbläsaren utan konto i första versionen. Filtren i **Alla rutor** påverkar inte **Mina rutor**.

Övningarna ska kunna organiseras i följande kategorier:

- Markering
- Dirigering och linjetag
- Sök och närsök
- Stadga och passivitet
- Stoppsignal
- Vattenarbete
- Ringträning

Svårighetsgrader:
- Nybörjare
- Fortsättning
- Avancerad

Varje övning ska kunna innehålla:
- Namn
- Kategori
- Svårighetsgrad
- Kort beskrivning
- Utrustning som behövs
- Instruktioner steg för steg
- Pedagogisk skiss
- Tips och vanliga misstag
- Förslag på enklare och svårare variationer
- Ungefärlig tidsåtgång om relevant

## Skapa och redigera övningar

Jag ska kunna skapa en övning via ett enkelt formulär.

Jag ska kunna skriva och ändra instruktionerna, skapa eller redigera en skiss och spara övningen.

Jag ska även kunna spara en övning som utkast innan den publiceras.

Det ska vara enkelt att gå tillbaka till en befintlig övning och ändra både text och skiss.

## Digitalt ritverktyg

Ritverktyget är en av appens viktigaste funktioner.

Jag ska kunna skapa en skiss genom att placera ut färdiga symboler på en träningsyta.

Symboler ska på sikt finnas för:
- Hund
- Förare
- Skytt och kastare som separata symboler
- Apport/dummy
- Träd och buskar
- Vatten
- Hinder

Jag ska kunna:
- Dra och flytta symboler med mus eller finger.
- Rita pilar för skickriktningar, kast och hundens väg samt lägga till linjer.
- Ändra och ta bort symboler.
- Spara skissen tillsammans med övningen.
- Öppna en sparad skiss och fortsätta redigera den.

Skisser ska lagras som redigerbara objekt och inte enbart som bilder.

Börja med förare och hund som ett gemensamt objekt, skytt, kastare, apport och pil. Använd tydliga symboler och prioritera enkel användning.

Använd projektets egna bildsymboler för hund och skytt. Visa hunden sittande bredvid den stående föraren i en gemensam symbol. Rita apporten som en liten, upprätt grön dummy med rundad botten och en liten ögla upptill. Visa bildsymbolerna utan synliga namn i själva skissen.

Visa kastaren som en mörkgrön silhuett med en utsträckt kastarm och en liten dummy i luften. Lämna en liten synlig glipa mellan handen och dummyn. Både skytten och kastaren ska kunna placeras vända åt höger eller vänster.

I ritverktyget visas namnen Skytt och Kastare en gång vardera, med två symbolknappar sida vid sida för riktningarna. Visa en liten pilsymbol vid både Pil och Streckad pil. Använd samma streckning som i skissen för Enkelmarkering.

Visa ekipaget bakifrån så att symbolen är neutral i sidled. Rita hunden som en smäcker jaktlabrador och föraren med smala, naturliga proportioner, jaktjacka och stövlar.

Samla Flytta, Ångra och Radera markerat objekt på en egen rad. Gruppera placeringsverktygen på separata rader. Ångra återställer senaste ändringen i skissen och räknar ett helt drag som en ändring.

Samla terrängsymbolerna Gräs, Björk, Gran och Dike på en egen rad. Håll grässymbolen liten. Rita diket långt och smalt med lätt ojämna kanter, små vattentecken och gräs vid kanterna. Varje symbol ska kunna placeras flera gånger i samma skiss.

## AI-funktioner – senare utveckling

På sikt ska AI kunna:
- Föreslå övningar utifrån användarens behov.
- Söka bland befintliga övningar.
- Föreslå enklare och svårare variationer.
- Föreslå språkliga förbättringar av texten i instruktionsfältet så att nya övningar följer samma stil som befintliga övningar. Bevara träningsupplägget och ordningen på stegen.
- Visa instruktioner som en automatiskt numrerad lista med ett redigerbart fält per steg i AI-förslaget, efter att förslaget har använts och när en sparad övning öppnas igen.
- Använd den publicerade övningen ”Enkelmarkering på öppen mark” som stilprov. Sikta på tre till fyra moment för enkla övningar. Samla detaljer som hör ihop i samma punkt och låt en punkt innehålla flera korta meningar. Skriv naturligt och konkret med tydligt tilltal. Behåll träningsupplägget, ordningen och viktiga villkor och råd.
- Skapa förslag till skisser utifrån text.

Grundfunktionerna ska fungera utan AI. Inför AI-funktionerna när grundappen fungerar. AI-genererade instruktioner och skisser ska kunna granskas och redigeras innan de sparas.

## Design

Använd den valda hundlogotypen i sidhuvudet mot en ljus bakgrund. Behåll originalfilens utseende, transparens och proportioner. Anpassa visningsstorleken för mobil och dator.

Färgriktning för nya startsidan: kombinera djup jaktgrön (#102E23) med klar flanellröd (#F00030). Prova rött i en större färgyta och i en tydlig detalj i logotypen. Använd nästan vit bakgrund (#F9F9F7), vita kort och nästan svart text (#171C18).

Bedöm storlek, linjering och mellanrum tillsammans från början när du lägger till eller ändrar en komponent. Se hur den samspelar med närliggande rubriker, etiketter och knappar på smala och breda skärmar. Låt gärna tryckytan vara större än den synliga knappen.

Startsidan har en bred öppning med jaktapportering, följd av ”Så funkar det” med bild bredvid kort text, tre visuella kort i rad på breda skärmar och en enkel sidfot. Använd generösa mellanrum och låt blocken staplas på mobil. Visa en stillbild tills det finns en öppningsfilm. Övningarna ligger i en egen vy som nås från huvudmenyn och startsidans huvudknapp.

Appen ska ha en modern, stilren och naturnära design.

Färgförslag:
- Mörkgrönt
- Salviagrönt
- Beige och andra ljusa naturtoner
- Mörkgrå text

Designen ska kännas professionell, pedagogisk och lättanvänd.

Undvik röriga menyer, onödiga funktioner och för många klick.

## Framtida funktioner
- Fritextsökning i övningsbanken kan övervägas på längre sikt.
- Fler symboler och bakgrunder.
- Uppladdning av egna skisser och foton.
- Egna samlingar av övningar.
- Delning av övningar.
- Egna träningsupplägg som kombinerar flera övningar och som instruktörer på sikt kan dela.
- AI-assistent.
- Möjlighet för andra användare att bidra.
