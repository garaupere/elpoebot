import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Assumim que 'dataset' i 'sillabes' ja estan definits
# Aquest script hauria de ser cridat després de preparar aquestes variables

def generar_heatmap_tonicitat(dataset, sillabes):
    """
    Genera un heatmap de tonicitat amb recompte de casos i percentatges.
    
    Paràmetres:
    -----------
    dataset : pd.DataFrame
        DataFrame amb les dades de síl·labes
    sillabes : list
        Llista de noms de columnes que contenen les dades de síl·labes
    """
    
    # syl_df ja ha de ser el DataFrame preparat (columnes '1'..'10' amb 1 indicant síl·laba tònica)
    syl_df = dataset[sillabes].apply(pd.to_numeric, errors='coerce').astype(float)

    # Preparar matriu: index/cols '1'..'10' (igual que tens)
    row_labels = [f'{i}' for i in range(1, 11)]
    col_labels = row_labels.copy()
    matriu = pd.DataFrame(index=row_labels, columns=col_labels, dtype=float)

    # Calcular recomptes i percentatges per a cada posició tònica
    for i in range(1, 11):
        col = str(i)
        mask = syl_df[col] == 1
        total_casos = mask.sum()
        
        if total_casos > 0:
            # Per a cada columna (posició de síl·laba), contem quants casos hi ha
            # quan la fila i té tonicitat
            counts = syl_df[mask].sum(axis=0)  # Suma de 1s per columna
            # Convertir a percentatge respecte del total de casos amb tonicitat a la posició i
            percentatges = (counts / total_casos) * 100
            percentatges.index = [f'{int(c)}' for c in percentatges.index]
            matriu.loc[f'{i}'] = percentatges
        else:
            matriu.loc[f'{i}'] = np.nan
        
        # La diagonal es manté com a 100% (un vers amb tonicitat a la posició i sempre té tonicitat a i)
        matriu.loc[f'{i}', f'{i}'] = 100.0

    matriu = matriu.astype(float).round(2)

    # Comptatges i percentatges per a la síl·laba tònica en cada posició
    total_versos = len(syl_df)
    tonic_counts = {}
    tonic_pcts = {}
    for i in range(1, 11):
        col = str(i)
        cnt = int((syl_df[col] == 1).sum()) if col in syl_df.columns else 0
        tonic_counts[f'{i}'] = cnt
        tonic_pcts[f'{i}'] = (cnt / total_versos * 100) if total_versos > 0 else np.nan

    # Dibuixar heatmap
    plt.figure(figsize=(8, 6))   # una mica més ample per deixar espai a la dreta
    ax = plt.gca()
    sns.heatmap(
        matriu.astype(float),
        mask=matriu.isna(),
        cmap="viridis",
        vmin=0.0,
        vmax=100.0,  # Canviat de 1.0 a 100.0 per a percentatges
        annot=True,
        fmt=".2f",
        linewidths=0.5,
        square=True,
        cbar_kws={"label": "percentatge (%)", "shrink": 0.6, "aspect": 20},  # Canviat de "tonicitat"
        ax=ax
    )

    # Ajustar límits horitzontals per deixar espai a la dreta per les anotacions
    n_cols = len(col_labels)
    n_rows = len(row_labels)
    ax.set_xlim(-0.5, n_cols + 2.0)  # deixa espai addicional a la dreta

    # Dibuixar línia vertical separadora (entre heatmap i columnes d'estadística)
    #ax.vlines(n_cols, ymin=0, ymax=n_rows, colors='gray', linewidth=1)

    # Anotar a la dreta de cada fila el count i el percentatge
    for idx, row_label in enumerate(matriu.index):
        # posició vertical del centre de la cel·la: idx + 0.5
        y = idx + 0.5
        x_text = n_cols + 0.3  # posició horitzontal a la dreta del heatmap
        cnt = tonic_counts.get(row_label, 0)
        pct = tonic_pcts.get(row_label, np.nan)
        if np.isnan(pct):
            s = f"{cnt} (n/d)"
        else:
            s = f"{cnt} ({pct:.2f}%)"
        ax.text(x_text, y, s, va='center', ha='left', fontsize=11)

    plt.tight_layout()
    plt.savefig('../gràfics/metre/heatmap_tonicitat_mètrica.png', dpi=600)
    plt.show()


if __name__ == "__main__":
    # Exemple d'ús (descomenta i adapta segons les teves dades)
    # dataset = pd.read_csv('dades.csv')
    # sillabes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    # generar_heatmap_tonicitat(dataset, sillabes)
    print("Script carregat correctament. Crida la funció generar_heatmap_tonicitat(dataset, sillabes) per generar el gràfic.")
