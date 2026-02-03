# elpoebot
Projecte dissenyat per Pere Garau Borràs amb motiu de l'exposició artística de Laura Torres Bauzà <i>L'escriptura en el relat artístic</i> (2022).
(c) 2022 Pere Garau Borràs

## Instal·lació

```bash
npm install
```

## Executar el servidor

```bash
npm start
```

El servidor s'executarà a http://localhost:3000

## Persistència de dades

L'aplicació ara desa les dades en fitxers al projecte:
- **corpus.txt**: Conté tots els versos afegits
- **book.json**: Conté tots els poemes generats

Les dades es mantenen entre sessions i són accessibles sempre.

## Important - Ús local

Aquest servidor està dissenyat per a ús local i exposicions artístiques.
**No està preparat per a producció** ja que no inclou:
- Limitació de taxa (rate limiting)
- Autenticació
- Validació exhaustiva d'entrada

Per a ús públic, considera afegir aquestes característiques de seguretat.
