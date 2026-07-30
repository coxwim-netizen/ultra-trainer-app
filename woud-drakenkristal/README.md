# Woud en het Drakenkristal 🐉💎

Een leuk leeravontuur voor kinderen in het eerste leerjaar (6 jaar), gebouwd met
React, TypeScript en Vite. Geen login, geen backend, geen reclame — alle
voortgang wordt lokaal in de browser bewaard.

**Verhaal:** het Drakenkristal is in drie stukken gebroken. Woud (de held)
reist naar de Drakengrot, Arendsberg en het Ninjabos, lost daar telkens een
korte oefening op en verzamelt zo de drie kristalstukken.

De avontuurkaart is een echte piratenkaart: een gestippeld pad verbindt de
drie plekken. De eerste plek staat altijd open; een volgende plek ontgrendelt
pas zodra de vorige is afgerond (al voltooide plekken blijven wel altijd
opnieuw speelbaar). Na een geslaagde oefening kraakt er een drakenei open op
de kaart, wandelt Woud naar de volgende plek, en barst er vuurwerk los — met
nog groter vuurwerk op het uiteindelijke overwinningsscherm.

## Snel starten

```bash
npm install
npm run dev
```

Open de getoonde `localhost`-link in de browser. Werkt op desktop, laptop,
tablet en telefoon.

Andere scripts:

```bash
npm run build     # productie-build (typecheck + vite build)
npm run preview   # bekijk de productie-build lokaal
npm run test      # voer de automatische tests uit
npm run lint      # oxlint
```

## Projectstructuur

```
src/
  types.ts                  # Gedeelde TypeScript-types (Question, LocationInfo, ProgressState, ...)
  data/                     # Alle inhoud (geen hardcoded teksten in de UI)
    locations.ts            # De 3 locaties + badges + kaartposities/ontgrendel-logica
    mathQuestions.ts         # Optel/aftrek-vragenbank (Drakengrot)
    readingQuestions.ts     # Leesvragenbank + scène-illustraties (Arendsberg)
    letterQuestions.ts      # Letter/woord-vragenbank + woordenlijst (Ninjabos)
    index.ts                # Verzamelt alle vragenbanken per categorie
  state/
    progressStore.ts        # localStorage lezen/schrijven
    GameContext.tsx          # React context: huidig scherm + voortgang + acties
  hooks/
    useExerciseSession.ts    # Herbruikbare oefen-logica (5 vragen, pogingen, feedback, help)
    useSpeech.ts             # Nederlandse spraaksynthese (voorlezen + herhalen)
    useSound.ts              # Lichte geluidseffecten via de Web Audio API
  components/
    characters/              # Vonk, Arend, Kage, Woud als originele SVG-tekeningen
    common/                  # Herbruikbare UI: knoppen, kristallen, sterretjes, vuurwerk, ei-animatie, modaal, ...
    exercises/                # ExerciseShell (gedeelde lay-out) + de 3 oefeningen
      interactions/           # De 5 interactieve antwoordmechanismen (zie hieronder) + AnswerStage
    screens/                  # Start, naam, kaart, oefenscherm, beloning, overwinning, ouders
  utils/random.ts             # Kies 5 willekeurige vragen per sessie
  App.tsx                     # Schermrouter (eenvoudige state machine, geen library nodig)
```

Alle inhoud (vragen, teksten, badges) staat in `src/data/`, niet verspreid in
de componenten. Dat maakt het makkelijk om later niveaus, locaties of talen
toe te voegen zonder de UI aan te raken.

## Interactieve antwoordmechanismen

Antwoorden kiezen is meer dan klikken. Elke sessie van 5 vragen doorloopt een
willekeurige volgorde van **5 verschillende mechanismen** — telkens 1 per
vraag, dus elke sessie gebruikt ze allemaal, in een andere volgorde:

- **Gooien** — tik om een sterretje te gooien; het juiste antwoord "valt om"
  als een kegel.
- **Slepen** — sleep het antwoord naar het karakter (Vonk / Arend's nest /
  Kage's poort).
- **Vangen** — de drie antwoorden zweven zachtjes; tik het juiste antwoord
  terwijl het beweegt.
- **Wegvegen** — veeg het juiste antwoord naar het karakter.
- **Verbinden** — trek een lijn van het karakter naar het juiste antwoord.

Dit zit in `src/components/exercises/interactions/`: elk mechanisme is een
eigen component (`DragInteraction.tsx`, `ThrowInteraction.tsx`, ...) achter
één gedeeld contract (`AnswerStageProps` in `types.ts`), en `AnswerStage.tsx`
kiest welk component getoond wordt. `useExerciseSession` bepaalt de volgorde
per sessie (`currentInteraction`) door de 5 mechanismen te schudden.

**Toegankelijkheid:** onder elk mechanisme zit gewoon een echte `<button>`.
Slepen, vegen en verbinden reageren op aanraking/muis-gestures, maar een
gewone klik of Enter/spatie (toetsenbord, schermlezer) selecteert het
antwoord altijd direct — niemand wordt uitgesloten van het spel omdat ze geen
muis of aanraakscherm gebruiken.

Een nieuwe oefening (zie hieronder) krijgt deze 5 mechanismen automatisch
door `<AnswerStage>` te gebruiken in plaats van zelf knoppen te tekenen.

## Een vierde oefening toevoegen

1. **Type:** voeg de nieuwe categorie toe aan `ExerciseCategory` in `src/types.ts`
   (bv. `'shapes'`).
2. **Data:** maak `src/data/shapesQuestions.ts` met een array van `Question`-
   objecten (zelfde vorm als de andere vragenbanken) en exporteer die.
3. **Registreer de vragenbank:** voeg de nieuwe bank toe aan `QUESTION_BANKS`
   in `src/data/index.ts`.
4. **Locatie:** voeg een nieuwe `LocationInfo` toe aan `LOCATIONS` in
   `src/data/locations.ts` (naam, gids, badge, kristalnaam, themaklasse) en een
   bijpassende badge aan `BADGES`.
5. **Component:** maak `src/components/exercises/ShapesExercise.tsx`. Gebruik
   `useExerciseSession('shapes', onSessionFinished)` voor de logica,
   `<ExerciseShell>` voor de vaste lay-out (locatienaam, gids, audio-knop,
   voortgang, hulpknop, feedback), en `<AnswerStage kind={session.currentInteraction} .../>`
   voor de antwoorden zelf — dat geeft de nieuwe oefening automatisch alle 5
   interactieve mechanismen. Kijk naar `MathExercise.tsx` als voorbeeld.
6. **Routering:** voeg de nieuwe categorie toe in `ExerciseScreen.tsx` zodat
   die naar het juiste component verwijst.
7. **(optioneel) Personage:** teken een nieuw personage als SVG-component in
   `src/components/characters/`, in dezelfde stijl als de bestaande figuren.
8. **Thema:** voeg een `.theme-<naam>` blok toe in `src/index.css` met eigen
   kleuren, zoals bij `.theme-drakengrot`.

Een nieuw CSS-thema en badge zijn optioneel — zonder aanpassing valt de nieuwe
locatie terug op de bestaande stijl.

## Meer vragen toevoegen

Open het juiste bestand in `src/data/` en voeg een item toe aan de
`TEMPLATES`-array:

- **Rekenen** (`mathQuestions.ts`): voeg `{ a, b, operator: '+' | '-', decoys: [x, y] }`
  toe. Zorg dat het antwoord tussen 0 en 10 blijft.
- **Lezen** (`readingQuestions.ts`): voeg een korte zin toe (max. ~6 woorden),
  het woord om te markeren bij een fout antwoord, en drie scène-ID's uit
  `READING_SCENES` (of voeg zelf een nieuwe scène toe aan die lijst).
- **Letters/woorden** (`letterQuestions.ts`): voeg een woord toe aan
  `WORD_BANK` (met emoji en eerste letter) en gebruik het in een `letter`- of
  `word`-template.

Elke sessie kiest automatisch 5 willekeurige vragen uit de volledige bank
(`QUESTIONS_PER_SESSION` in `src/data/index.ts`), dus meer vragen toevoegen
zorgt vanzelf voor meer variatie.

## Assets

Er worden geen externe afbeeldingen of lettertypes van het internet geladen —
dat voorkomt dat het spel offline of later kapot gaat.

- **Personages en illustraties:** eigen, originele SVG-tekeningen, rechtstreeks
  als React-componenten geschreven (`src/components/characters/`). Geen
  bestaande personages of merken nagemaakt.
- **Scène- en woordplaatjes:** standaard Unicode-emoji, gecombineerd in kaarten
  (`READING_SCENES`, `WORD_BANK`). Werkt overal zonder afbeeldingen te laden.
- **Geluid:** korte toontjes gegenereerd met de Web Audio API
  (`src/hooks/useSound.ts`) — geen geluidsbestanden nodig.
- **Stem:** de browser-eigen Speech Synthesis API leest instructies voor in
  het Nederlands (`src/hooks/useSpeech.ts`), indien de browser dat ondersteunt.
- **Lettertype:** systeemlettertypes (`Baloo 2`/`Comic Sans MS`/rounded
  system-ui als terugval) — geen lettertype-bestanden nodig.

## Automatische tests

Er is een basistest per oefentype in `src/components/exercises/`:

- `MathExercise.test.tsx`
- `ReadingExercise.test.tsx`
- `LetterExercise.test.tsx`

Elke test rondt een volledige sessie van 5 vragen af (het juiste antwoord
wordt afgeleid uit de vragenbank, niet hardgecodeerd) en controleert dat de
sessie correct wordt afgesloten. De wiskundetest controleert ook dat een fout
antwoord de voortgang niet reset en dat een nieuwe poging mogelijk blijft.
Elk antwoord wordt in deze tests via een gewone klik gekozen — dat werkt
altijd, ongeacht welk van de 5 mechanismen net actief is (zie hierboven),
omdat elk mechanisme een echte klikbare knop als toegankelijke basis houdt.

Daarnaast controleert `useExerciseSession.test.tsx` dat een sessie van 5
vragen ook echt alle 5 interactieve mechanismen precies één keer gebruikt.

```bash
npm run test
```

## Handmatige testchecklist voor ouders

Gebruik dit lijstje om snel te controleren of alles goed werkt na het starten
van `npm run dev`:

- [ ] Startscherm toont de titel en een grote "Start avontuur"-knop.
- [ ] Naamscherm onthoudt de ingevoerde naam (herlaad de pagina en start
      opnieuw — de naam staat nog in het instellingenmenu/oudergebied).
- [ ] Op de avontuurkaart is alleen Drakengrot in het begin open; Arendsberg
      en Ninjabos tonen een slotje en zijn nog niet speelbaar.
- [ ] Na het afronden van Drakengrot kraakt er een ei open op de kaart,
      wandelt Woud naar Arendsberg, en verschijnt er kort vuurwerk — daarna is
      Arendsberg ontgrendeld.
- [ ] Een al voltooide plek blijft aanklikbaar en opnieuw speelbaar, ook nadat
      een latere plek ontgrendeld is.
- [ ] Binnen één sessie van 5 vragen wisselt het antwoordmechanisme (gooien,
      slepen, vangen, wegvegen, verbinden) — en dus ook de plek van het juiste
      antwoord — telkens van vraag tot vraag.
- [ ] Elk mechanisme is ook met alleen het toetsenbord te bedienen (Tab +
      Enter/spatie op een antwoord selecteert het direct).
- [ ] In de Drakengrot toont elke vraag kristallen die overeenkomen met het
      getal, en leidt een fout antwoord tot een nieuwe poging (geen
      "Fout"-melding, geen verloren levens).
- [ ] Op Arendsberg speelt de audio-knop de zin voor (indien de browser dit
      ondersteunt) en kies je uit drie plaatjes.
- [ ] In het Ninjabos wissel je tussen "welke letter" en "welk woord"-vragen.
- [ ] De "Help mij"-knop werkt in alle drie de oefeningen en geeft een
      duidelijke hint zonder het antwoord meteen te verklappen.
- [ ] Na 5 vragen verschijnt het beloningsscherm met het kristalstuk, de badge
      en sterretjes, en brengt "Terug naar de kaart" je terug.
- [ ] Een locatie is opnieuw speelbaar nadat hij al voltooid is.
- [ ] Na alle drie de locaties verschijnt het overwinningsscherm met de naam
      van het kind, de drie badges, en vuurwerk.
- [ ] Het geluid-aan/uit-knopje en het instellingenmenu werken vanaf het
      startscherm.
- [ ] Het oudergebied (instellingen ingedrukt houden gedurende 3 seconden)
      toont voortgang in vriendelijke taal, zonder cijfers of rode
      waarschuwingen.
- [ ] "Wis voortgang" (in instellingen én in het oudergebied) vraagt eerst om
      bevestiging voor het echt alles wist.
- [ ] Alles blijft goed leesbaar en aanklikbaar op een telefoon- en
      tabletformaat (test via de browser devtools of een echt toestel).
- [ ] Sluit de browser en open de pagina opnieuw: de voortgang (badges,
      kristallen) is bewaard.

## Beperkingen van deze eerste versie

- Eén moeilijkheidsgraad; het datamodel (`difficulty: 1 | 2 | 3`) is al
  voorbereid op extra niveaus later.
- Spraaksynthese en de aangeboden Nederlandse stem hangen af van wat de
  browser/het besturingssysteem ondersteunt; op sommige apparaten is er geen
  Nederlandse stem beschikbaar en blijft de audio-knop uitgeschakeld.
- Geen accountsysteem: voortgang is gebonden aan één browser op één toestel.
