# Ultra Trainer — secure Netlify version

## Wat is aangepast
- Anthropic API key verwijderd uit de frontend
- Strava client secret verwijderd uit de frontend
- Netlify Functions toegevoegd voor:
  - Claude
  - Strava token exchange
  - Strava activity sync
- Firebase login verplicht voor function calls

## Uploaden naar Netlify
Upload de volledige map of de zip als nieuwe site.

## Environment variables in Netlify
Voeg deze toe in:
Site configuration -> Environment variables

- ANTHROPIC_API_KEY=...
- ANTHROPIC_MODEL=claude-3-5-haiku-latest
- STRAVA_CLIENT_ID=...
- STRAVA_CLIENT_SECRET=...
- FIREBASE_PROJECT_ID=ultra-trail-training-app

## Strava app instelling
In Strava developer settings:
- Authorization Callback Domain = jouw-netlify-domein.netlify.app

## Belangrijk
- Firebase web config in de frontend is normaal en niet geheim
- Je betaalde API key staat nu alleen server-side in Netlify
- De Netlify functions accepteren alleen requests van ingelogde Firebase users van jouw project


## Nieuwe beveiliging
- `AI_DAILY_LIMIT` (optioneel, default 20)
- `AI_MIN_INTERVAL_MS` (optioneel, default 12000)

De AI coach gebruikt nu een dagelijkse limiet per ingelogde gebruiker en een korte cooldown tussen requests.


## Nieuw: database en profiel
Deze versie gebruikt Firebase Firestore voor gebruikersprofielen.

### Firestore activeren
1. Open Firebase Console
2. Kies project `ultra-trail-training-app`
3. Ga naar **Firestore Database**
4. Klik **Create database**
5. Start in production mode of test mode
6. Voeg daarna deze rule toe:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Authentication
Zet in Firebase Authentication minstens deze sign-in methods aan:
- Google
- Email/Password

### Wat nu in de database staat
Per gebruiker wordt een document gemaakt in:
`users/{uid}`

Velden:
- displayName
- email
- photoURL
- startDate
- goalDistance
- experienceLevel
- preferredDays
- notes
- stravaConnected
- onboardingDone
- createdAt
- updatedAt


## Nieuw: onboarding
Nieuwe accounts krijgen nu een onboarding flow met 5 stappen:
1. aanspreeknaam
2. trainingsdoel
3. huidig niveau
4. Strava koppelen
5. startdatum

De onboarding schrijft direct weg naar Firestore in `users/{uid}`.


## Nieuw: professionelere onboarding
Deze versie maakt de onboarding meer app-achtig:
- sterkere hero bovenaan
- 1 onderwerp per scherm
- aparte stap 'Van start gaan'
- daarna pas Strava koppelen
- welkomscherm na afronden


## Nieuw: menu + betere statistieken
- Strava uit de footer gehaald
- menu rechtsboven toegevoegd
- menu bevat dashboard, schema, statistieken, profiel, Strava en log uit
- statistieken hebben nu een periodefilter:
  - afgelopen week
  - deze maand
  - dit jaar
- nieuw blok: `Bekijk je snelste tijden`
- afstanden: 5, 10, 15, 21 en 42 km

Let op:
de snelste tijden worden in deze versie geschat op basis van totale Strava-runs die minstens zo lang zijn als de gekozen afstand.
Voor echte segment- of best effort-data per afstand zou een extra Strava API-uitbreiding nodig zijn.


## Nieuw: echte PR-module + trends
- PR-module toont nu:
  - snelste tijd
  - datum
  - activiteitnaam
  - pace op je PR
- PR-overzicht voor 5, 10, 15, 21,1 en 42,2 km
- Trends toont nu:
  - weekvolume trend
  - pace trend
  - consistentie
  - lange duur trend

Let op:
deze versie gebruikt nog steeds berekende best efforts uit je gesynchroniseerde Strava-runs.
Voor echte officiële Strava best efforts en echte splits per activiteit is een diepere Strava API-sync nodig.


## Nieuw: feedback na run + adaptieve training
- na een nieuwe gesynchroniseerde Strava-run verschijnt een pop-up
- eerst motivatie
- daarna 1 simpele vraag: hoe voelde de run?
- de app bewaart dit per activiteit in Firestore:
  - `users/{uid}/activity_feedback/{activityId}`
- coach geeft daarna directe feedback
- als 2 feedbacks na elkaar moeilijk of heel zwaar zijn:
  - volgende training wordt lichter gemaakt
  - de app toont dat ook meteen op het dashboard

### Extra Firestore regels
Voeg deze ook toe naast je bestaande `users/{uid}` rule:

```js
match /users/{userId}/activity_feedback/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /users/{userId}/coach_state/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```


## Nieuw: meerdere loopplannen
Beschikbare plannen in de app:
- 21 km
- 42 km
- 80 km ultra

De onboarding toont nu alleen afstanden waarvoor een plan beschikbaar is.
De 21 km- en 42 km-plannen zijn toegevoegd op basis van de aangeleverde schema's.


## Vercel-ready versie
Deze build gebruikt nu Vercel API routes:
- `/api/claude`
- `/api/public-config`
- `/api/strava-token`
- `/api/strava-activities`

### Nog doen in Firebase
Voeg je Vercel-domein toe in:
- Firebase Authentication -> Settings -> Authorized domains

Voorbeeld:
- `jouw-project.vercel.app`

### Belangrijke noot
De AI-limiet draait in deze Vercel-versie als een best-effort memory limiter.
Dat voorkomt eenvoudige spam, maar is niet zo hard als de Netlify blobs-versie.
Voor een echte harde limiet heb je later een persistente store nodig.
