# Richiesta di Sviluppo: Estensione ed Evoluzione App "Random Sex Position"

Voglio implementare una serie di modifiche e nuove funzionalità partendo dalla repository sorgente (https://github.com/raminr77/random-sex-position/tree/main). L'applicazione deve rimanere **totalmente offline**, eseguita in locale e senza l'utilizzo di database complessi o backend remoti (persistenza affidata a `localStorage` o strutture JSON locali). Aggiungere che è stata modificata da me, ma il lavoro di baseè di raminr77 come da indicazione dell'MIT license. Se puoi sistema le icon per l'apk

Di seguito l'elenco dettagliato delle specifiche tecniche e funzionali da implementare:

## 1. Sistema di Preferiti e Filtraggio
- **Filtro Preferiti:** Aggiungere un interruttore/filtro per estrarre casualmente o visualizzare *solo* le posizioni preferite.

## 2. Nuova Tassonomia e Tagging Avanzato
Arricchire il modello dati di ciascuna posizione nel dataset (struttura JSON) introducendo i seguenti attributi e relativi filtri di ricerca combinabili:
- **Tipologia di penetrazione:** Tag booleani o multipli per distinguere tra **Anale** e **Vaginale**.
- **Stimolazione Orale:** Tag booleano per indicare la presenza o meno del sesso orale.
- **Stato di esecuzione ("Già fatta"):** Indicatore booleano per tracciare se una posizione è stata già provata o meno, con la possibilità di filtrarle (es. escludere quelle già fatte o visualizzarle tutte).


## 3. Aggiornare i tag manualmente dall'app
- L'utente deve poter aggiornare i tag per correggere eventuali errori/aggiungere info mancanti direttamente dall'app

## 4. Motore di Estrazione Casuale con Filtri
- Aggiornare la logica di estrazione randomica affinché rispetti simultaneamente tutti i filtri attivi impostati dall'utente (es. *Solo Preferiti* + *Compatibile Anale* + *Luogo: Letto* + *Non ancora fatta*).
- Se nessun elemento corrisponde ai filtri selezionati, l'interfaccia deve gestirlo correttamente mostrando un avviso chiaro anziché bloccarsi.


_
---
**Obiettivo per Antigravity:** Analizza la codebase esistente del repository, adatta la struttura dei dati (JSON) inserendo i nuovi tag e le proprietà descritte, aggiorna l'interfaccia utente con i controlli di filtro necessari e adegua la logica JavaScript di generazione casuale e salvataggio locale.
