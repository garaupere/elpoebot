# Resum dels Canvis: Heatmap de Tonicitat

## Què s'ha canviat?

S'ha implementat la conversió del heatmap de tonicitat mètrica per mostrar **recomptes de casos i percentatges** en lloc de **mitjanes de tonicitat**.

## Canvis Clau

### 1. Càlcul de la Matriu
**ABANS:**
```python
avg = syl_df[mask].mean(axis=0)  # Mitjana entre 0 i 1
```

**DESPRÉS:**
```python
counts = syl_df[mask].sum(axis=0)  # Recompte de casos
percentatges = (counts / total_casos) * 100  # Percentatge sobre el total
```

### 2. Valors de la Matriu
- **ABANS:** Valors entre 0.0 i 1.0 (proporcions)
- **DESPRÉS:** Valors entre 0.0 i 100.0 (percentatges)

### 3. Etiqueta de la Barra de Color
- **ABANS:** `"tonicitat"`
- **DESPRÉS:** `"percentatge (%)"`

### 4. Escala de Colors
- **ABANS:** `vmin=0.0, vmax=1.0`
- **DESPRÉS:** `vmin=0.0, vmax=100.0`

### 5. Diagonal de la Matriu
- **ABANS:** `matriu.loc[f'{i}', f'{i}'] = 1.0`
- **DESPRÉS:** `matriu.loc[f'{i}', f'{i}'] = 100.0`

## Interpretació dels Resultats

### Exemple de Lectura del Heatmap

Si la cel·la a la fila 6, columna 8 mostra `15.50%`:
- **Significat:** Del total de versos amb tonicitat a la posició 6, el 15.50% també tenen tonicitat a la posició 8

La diagonal (6,6) mostra sempre `100.00%`:
- **Significat:** Del total de versos amb tonicitat a la posició 6, el 100% tenen tonicitat a la posició 6 (òbviament!)

### Columna de Recomptes a la Dreta

Cada fila mostra informació addicional:
- Format: `N (XX.XX%)`
- **N**: Recompte absolut de versos amb tonicitat a aquesta posició
- **XX.XX%**: Percentatge respecte del total de versos del corpus

**Exemple:** `40 (20.00%)` a la fila 6
- Hi ha 40 versos amb tonicitat a la posició 6
- Això representa el 20% del total de versos del corpus

## Fitxers Creats

1. **`heatmap_tonicitat_metrica.py`** - Script principal amb la funció reutilitzable
2. **`test_heatmap.py`** - Tests automàtics per validar els càlculs
3. **`exemple_heatmap.py`** - Exemple d'ús amb dades simulades
4. **`README_HEATMAP.md`** - Documentació completa
5. **`requirements_heatmap.txt`** - Dependències Python necessàries

## Execució

### Instal·lar Dependències
```bash
pip install -r requirements_heatmap.txt
```

### Executar l'Exemple
```bash
python3 exemple_heatmap.py
```

### Executar els Tests
```bash
python3 test_heatmap.py
```

### Usar en el Teu Codi
```python
from heatmap_tonicitat_metrica import generar_heatmap_tonicitat

# Amb les teves dades
generar_heatmap_tonicitat(dataset, sillabes)
```

## Visualització Generada

El heatmap generat mostra:
- ✅ Percentatges en lloc de mitjanes (0-100% en lloc de 0-1)
- ✅ Diagonal sempre al 100%
- ✅ Barra de color amb etiqueta "percentatge (%)"
- ✅ Anotacions amb recomptes i percentatges a la dreta
- ✅ Colors viridis per a una visualització clara

## Validació

Tots els tests passen correctament:
- ✓ La diagonal és correctament 100%
- ✓ Els percentatges es calculen correctament
- ✓ La matriu es genera sense errors
- ✓ El gràfic es guarda correctament
