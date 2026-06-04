# Ordel-hjälp

En webbaserad hjäplare för det svenska språkspelet Ordel (Swedish Wordle).

## Funktioner

- **Sök efter ord** baserat på:
  - Rätt bokstäver på rätt plats i fem separata rutor
  - Bokstäver som måste vara med men på fel plats, angivna per position
  - Bokstäver som ska uteslutas
- **Responsiv design** - fungerar på desktop och mobil
- **Snabb sökning** - ingen backend behövs
- **Lokal lagring** - ord lagras i webbläsaren

## Installation

1. Klona eller ladda ner mappen `ordel`
2. Öppna en terminal och navigera till mappen
3. Starta en lokal webserver:

```bash
# Med Node.js
npx http-server
```

4. Öppna http://localhost:8080 i din webläsare

## Hur man använder

### Sök efter ord

1. **Rätt bokstäver på rätt plats**: Skriv bokstäverna som är på rätt plats i de fem rutorna och lämna okända platser tomma
   - Exempel: skriv `S` i första rutan och `E` i sista för ord som börjar med S och slutar med E

2. **Bokstäver som finns men är på fel plats**: Skriv bokstäverna i rutan för den plats där de inte får stå. Varje ruta kan innehålla upp till fyra bokstäver
   - Exempel: skriv `RN` i andra rutan om ordet måste innehålla R och N, men ingen av dem får stå på plats 2

3. **Bokstäver att utesluta**: Skriv bokstäver som inte ska finnas i ordet
   - Exempel: `XYZ` betyder att ordet inte får innehålla X, Y eller Z

4. Klicka på **Sök** eller resultaten uppdateras automatiskt
5. Klicka på ett ord för att kopiera det

## Ordlistan

Appen levereras med 4636 unika fembokstavsord extraherade från [SAOL 14 (2015) - faksimil | Språkbanken Text](https://spraakbanken.gu.se/resurser/saol14-faksimil). Orddata kommer från en lista licensierad under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

### Lägg till egna ord

Öppna `words.js` och lägg till ord i `WORDS`-arrayen:

```javascript
const WORDS = ['abbot', 'abort', ...'nyord']
```

**Viktigt**: Alla ord måste vara exakt 5 bokstäver långa och endast innehålla bokstäver (a-z, å, ä, ö).

## Teknologi

- **Vue.js 3** - Reaktivt gränssnitt
- **HTML5 & CSS3** - Responsiv design
- **Vanilla JavaScript** - Snabb sökning

## Fil struktur

```
ordel/
├── index.html      # Huvudfil med HTML
├── app.js          # Vue.js app och söklogik
├── styles.css      # Sidans styling
├── words.js        # Ordlistan
└── README.md       # Detta dokument
```

## Tips

- Du kan öppna DevTools (F12) och se antal ord i ordlistan
- Sökningen är skiftokänslig (både stora och små bokstäver fungerar)
- I fel-platsrutorna hoppar mellanslag framåt och backspace i en tom ruta går tillbaka
- Samma bokstav i flera fel-platsrutor räknas som minst en förekomst, inte en per ruta
- Ord med å, ä, ö stöds fullt ut
- Maximalt 100 ord visas åt gången (om det finns fler än 100 resultat)

## Felsökning

### Inga ord dyker upp

- Kontrollera att `words.js` är laddad (öppna DevTools och se Console)
- Säkerställ att `words.js` ligger i samma mapp som `index.html`

### Sökningen är långsam

- Detta bör aldrig inträffa - sökningen är optimerad för upp till 10 000 ord
- Om det är långsamt, kontrollera webbläsarens DevTools Console för fel

### Ord är inte 5 bokstäver

- Endast 5-bokstavsord stöds i denna version
- Ordlistan filtreras automatiskt för att endast innehålla giltiga ord

## Framtida förbättringar

- [ ] Importera ordlistor från CSV/JSON-filer
- [ ] Mörkt läge
- [ ] Historik över tidigare sökningar
- [ ] PWA (Progressive Web App) för offline-funktion

## Licens

Appkoden är licensierad under MIT, se [LICENSE](LICENSE).

Ordlistan bygger på [SAOL 14 (2015) - faksimil | Språkbanken Text](https://spraakbanken.gu.se/resurser/saol14-faksimil), som tillhandahålls under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). Vid vidare användning av orddata ska källan attribueras.

---

**Utvecklad med Vue.js 3** | För svenska Wordle-entusiaster
