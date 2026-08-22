**DOCUMENTO DI HANDOFF ARCHITETTURALE E OPERATIVO**
**Destinatario:** Sistema AI (Antigravity)
**Oggetto:** Risoluzione criticità di deployment, configurazione PWA e generazione APK per applicativo React/Vite.

---

### 1. CONTESTO DI PROGETTO

Il progetto richiede la trasposizione di un'applicazione web front-end (fork del repository `raminr77/random-sex-position`) in una Progressive Web App (PWA) pienamente conforme, con il fine ultimo di incapsularla in un pacchetto nativo Android (APK) avvalendosi della piattaforma di compilazione PWABuilder.
L'infrastruttura tecnologica in essere si fonda sull'impiego della libreria React, del linguaggio TypeScript e del bundler Vite. L'hosting dell'applicativo è delegato all'ambiente GitHub Pages, supportato da una pipeline di Continuous Integration e Continuous Deployment (CI/CD) orchestrata tramite GitHub Actions, la quale impiega `pnpm` quale gestore dei pacchetti.

### 2. PROBLEMATICHE RISCONTRATE (STATO DELL'ARTE)

Nonostante l'avvenuta configurazione formale del workflow YAML per il dispiegamento automatizzato, l'ambiente di produzione presenta allo stato attuale plurime discrasie strutturali che inibiscono l'esecuzione del codice e la validazione del pacchetto:

1. **Mancata Renderizzazione del DOM (Sindrome dello Schermo Bianco):** L'applicativo, una volta dispiegato sull'infrastruttura GitHub Pages, restituisce una schermata totalmente neutra e priva di contenuti. Tale anomalia è strettamente ascrivibile alla configurazione di root del motore Vite: essendo il sito ospitato all'interno di una sottodirectory (`/random-sex-position/`), l'assenza di una direttiva `base` esplicita fa sì che le risorse JavaScript e CSS transpilate vengano richieste alla radice assoluta del dominio, generando errori di protocollo HTTP 404 a cascata.
2. **Esclusione degli Asset Statici PWA dal Processo di Build:** I file mandatori per la qualificazione architetturale della PWA — segnatamente il file di configurazione `manifest.json`, l'engine di memorizzazione locale `sw.js` (Service Worker), le icone vettoriali o raster (`icon-192.png`, `icon-512.png`) e gli screenshot dimostrativi — sono stati originariamente allocati nella directory radice del repository. Conseguentemente, il processo di transpilazione e *bundling* gestito da Vite li ignora in toto, omettendone il trasferimento nella cartella di produzione definitiva (`dist`). Di riflesso, l'analizzatore di PWABuilder rileva l'assenza di tali requisiti sull'endpoint pubblico, invalidando la generazione dell'APK.
3. **Incoerenze di Routing e Sintassi nel File Entrypoint:** Il documento HTML principale (`index.html`) risulta viziato da path assoluti incompatibili con il deploy in sottocartella (es. `/images/...` invece di path relativi o interpolati dinamicamente), presenta dichiarazioni ridondanti o conflittuali dei metadati (doppia invocazione del file manifest) e necessita di una bonifica profonda per garantire che la registrazione asincrona del Service Worker avvenga con il corretto parametro di *scope*.

### 3. OBIETTIVI E DIRETTIVE DI INTERVENTO (TASK RICHIESTI)

Si richiede l'esecuzione sequenziale e la stesura del codice correttivo per i seguenti punti nevralgici:

1. **Riconfigurazione del Bundler Vite:** Redigere la sintassi esatta per la modifica o la creazione del file `vite.config.ts` (o analogo formato JavaScript), iniettando inderogabilmente la direttiva `base: '/random-sex-position/'` (o dinamica tramite variabili d'ambiente). Questo intervento è vitale per forzare la risoluzione corretta degli asset all'interno dell'ambiente di hosting GitHub Pages.
2. **Ristrutturazione Logica dell'Alberatura del Repository:** Definire un piano di ricollocazione categorica di tutti gli asset statici sopracitati (`manifest.json`, `sw.js`, icone, screenshot) all'interno della directory di sistema `public/`. È necessario fornire istruzioni affinché il Service Worker, una volta riposizionato e distribuito, mantenga la propria efficacia operativa (Network-First o Cache-First) senza subire declassamenti dovuti a limitazioni di scope.
3. **Refactoring Integrale del Codice HTML:** Fornire una versione purificata, ottimizzata e priva di collisioni del file `index.html`. Tale documento dovrà esibire percorsi di collegamento relativi o avvalersi delle macro di Vite, includere lo script di intercettazione e registrazione del Service Worker, e presentare esclusivamente i tag `<meta>` essenziali per le metriche di usabilità mobile.
4. **Validazione della Compatibilità PWA-APK:** L'obiettivo conclusivo dell'intervento è garantire che, a valle dell'esecuzione automatica della pipeline GitHub Actions (già configurata), la directory `dist` generata esponga un endpoint web che superi con esito positivo il 100% dei requisiti diagnostici richiesti dal tool PWABuilder. L'applicativo risultante dovrà essere esente dal difetto dello schermo bianco, capace di operare in modalità integralmente offline e idoneo a essere impacchettato e firmato crittograficamente per l'installazione nativa su ecosistema Android.
