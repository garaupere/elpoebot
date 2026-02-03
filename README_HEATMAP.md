# Heatmap de Tonicitat Mètrica

Aquest directori conté els scripts per generar un heatmap de tonicitat mètrica amb recompte de casos i percentatges.

## Canvis Implementats

### Abans (mitjana de tonicitat)
- La matriu mostrava mitjanes de tonicitat (valors entre 0 i 1)
- La barra de color indicava "tonicitat"
- Els valors representaven proporcions decimals

### Després (recompte i percentatge)
- La matriu mostra **percentatges** (valors entre 0 i 100%)
- Cada cel·la indica el % de versos amb tonicitat a la posició de fila que també tenen tonicitat a la posició de columna
- La diagonal és sempre 100% (un vers amb tonicitat a la posició i sempre té tonicitat a i)
- La barra de color mostra "percentatge (%)"
- A la dreta de cada fila es mostra el recompte total i el percentatge respecte del total de versos

## Fitxers

- **`heatmap_tonicitat_metrica.py`**: Script principal amb la funció `generar_heatmap_tonicitat()`
- **`test_heatmap.py`**: Tests per validar la lògica dels càlculs
- **`exemple_heatmap.py`**: Exemple d'ús amb dades simulades

## Requisits

```bash
pip install numpy pandas matplotlib seaborn
```

## Ús

```python
import pandas as pd
from heatmap_tonicitat_metrica import generar_heatmap_tonicitat

# Preparar les teves dades
# dataset: DataFrame amb les teves dades de versos
# sillabes: llista de noms de columnes ['1', '2', '3', ..., '10']

# Generar el heatmap
generar_heatmap_tonicitat(dataset, sillabes)
```

## Sortida

El heatmap es guarda a: `../gràfics/metre/heatmap_tonicitat_mètrica.png`

## Exemple

Per veure un exemple amb dades simulades:

```bash
python3 exemple_heatmap.py
```

## Tests

Per executar els tests:

```bash
python3 test_heatmap.py
```

## Càlculs

Per cada posició de tonicitat `i` (files):
1. Seleccionar tots els versos amb tonicitat a la posició `i`
2. Per cada posició `j` (columnes), comptar quants d'aquests versos també tenen tonicitat a `j`
3. Calcular el percentatge: `(count_j / total_versos_amb_tonicitat_i) * 100`
4. La diagonal sempre és 100% (un vers amb tonicitat a `i` sempre té tonicitat a `i`)

## Visualització

- **Mapa de calor**: Mostra els percentatges amb una escala de color viridis (0-100%)
- **Anotacions**: Cada cel·la mostra el percentatge amb 2 decimals
- **Columna dreta**: Mostra el recompte absolut i el percentatge respecte del total de versos per cada posició
  - Format: `N (XX.XX%)` on N és el recompte i XX.XX% el percentatge

## Nota

Aquest script és independent de l'aplicació web principal d'El Poebot i s'utilitza per anàlisi de dades i visualització de corpus.
