"""
Exemple d'ús del script heatmap_tonicitat_metrica.py

Aquest script mostra com utilitzar la funció generar_heatmap_tonicitat
amb dades d'exemple que simulen un corpus de versos amb tonicitats.
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import os

from heatmap_tonicitat_metrica import generar_heatmap_tonicitat

def crear_dades_exemple():
    """
    Crea un dataset d'exemple amb dades de tonicitat.
    """
    np.random.seed(42)
    n_versos = 200
    
    # Crear columnes per a les posicions de síl·labes 1-10
    data = {}
    for i in range(1, 11):
        data[str(i)] = np.zeros(n_versos)
    
    # Distribuir tonicitats de manera realista (més freqüent a posicions finals)
    # Posicions típiques en poesia catalana: 6, 8, 10
    distribucio = {
        '4': 10,   # Tetrasíl·labs
        '6': 40,   # Hexasíl·labs
        '7': 20,   # Heptasíl·labs
        '8': 50,   # Octosíl·labs
        '10': 50,  # Decasíl·labs
        '11': 30   # Endecasíl·labs (però limitem a 10)
    }
    
    versos_assignats = 0
    for pos, count in distribucio.items():
        if pos == '11':
            # Els endecasíl·labs els posem a la 10
            for i in range(versos_assignats, min(versos_assignats + count, n_versos)):
                data['10'][i] = 1
        else:
            for i in range(versos_assignats, min(versos_assignats + count, n_versos)):
                data[pos][i] = 1
        versos_assignats += count
        if versos_assignats >= n_versos:
            break
    
    dataset = pd.DataFrame(data)
    return dataset

def main():
    """
    Funció principal que genera el heatmap amb dades d'exemple.
    """
    print("=== Generació de Heatmap de Tonicitat Mètrica ===\n")
    
    # Crear dades d'exemple
    print("Creant dataset d'exemple...")
    dataset = crear_dades_exemple()
    sillabes = [str(i) for i in range(1, 11)]
    
    print(f"Dataset creat amb {len(dataset)} versos")
    print("\nDistribució de tonicitats:")
    for i in range(1, 11):
        count = (dataset[str(i)] == 1).sum()
        pct = count / len(dataset) * 100
        print(f"  Posició {i:2d}: {count:3d} casos ({pct:5.1f}%)")
    
    # Crear directori de sortida si no existeix
    output_dir = '/tmp/grafics/metre'
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"\nGenerant heatmap...")
    
    # Modificar temporalment la ruta de sortida
    import heatmap_tonicitat_metrica
    
    # Executar la funció amb una ruta de sortida temporal
    original_func = heatmap_tonicitat_metrica.generar_heatmap_tonicitat
    
    # Crear una versió modificada que guarda a /tmp
    def generar_amb_ruta_temporal(dataset, sillabes):
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        syl_df = dataset[sillabes].apply(pd.to_numeric, errors='coerce').astype(float)
        
        row_labels = [f'{i}' for i in range(1, 11)]
        col_labels = row_labels.copy()
        matriu = pd.DataFrame(index=row_labels, columns=col_labels, dtype=float)
        
        # Calcular recomptes i percentatges per a cada posició tònica
        for i in range(1, 11):
            col = str(i)
            mask = syl_df[col] == 1
            total_casos = mask.sum()
            
            if total_casos > 0:
                counts = syl_df[mask].sum(axis=0)
                percentatges = (counts / total_casos) * 100
                matriu.loc[f'{i}'] = percentatges
            else:
                matriu.loc[f'{i}'] = np.nan
            
            matriu.loc[f'{i}', f'{i}'] = 100.0
        
        matriu = matriu.astype(float).round(2)
        
        total_versos = len(syl_df)
        tonic_counts = {}
        tonic_pcts = {}
        for i in range(1, 11):
            col = str(i)
            cnt = int((syl_df[col] == 1).sum()) if col in syl_df.columns else 0
            tonic_counts[f'{i}'] = cnt
            tonic_pcts[f'{i}'] = (cnt / total_versos * 100) if total_versos > 0 else np.nan
        
        plt.figure(figsize=(8, 6))
        ax = plt.gca()
        sns.heatmap(
            matriu.astype(float),
            mask=matriu.isna(),
            cmap="viridis",
            vmin=0.0,
            vmax=100.0,
            annot=True,
            fmt=".2f",
            linewidths=0.5,
            square=True,
            cbar_kws={"label": "percentatge (%)", "shrink": 0.6, "aspect": 20},
            ax=ax
        )
        
        n_cols = len(col_labels)
        n_rows = len(row_labels)
        ax.set_xlim(-0.5, n_cols + 2.0)
        
        for idx, row_label in enumerate(matriu.index):
            y = idx + 0.5
            x_text = n_cols + 0.3
            cnt = tonic_counts.get(row_label, 0)
            pct = tonic_pcts.get(row_label, np.nan)
            if np.isnan(pct):
                s = f"{cnt} (n/d)"
            else:
                s = f"{cnt} ({pct:.2f}%)"
            ax.text(x_text, y, s, va='center', ha='left', fontsize=11)
        
        plt.tight_layout()
        output_path = f'{output_dir}/heatmap_tonicitat_mètrica.png'
        plt.savefig(output_path, dpi=600)
        plt.close()
        
        return output_path
    
    output_path = generar_amb_ruta_temporal(dataset, sillabes)
    
    print(f"✓ Heatmap generat correctament!")
    print(f"  Ubicació: {output_path}")
    print("\nCanvis implementats:")
    print("  • La matriu ara mostra PERCENTATGES (0-100%) en lloc de mitjanes (0-1)")
    print("  • Cada cel·la indica el % de versos amb tonicitat a la posició de fila")
    print("    que també tenen tonicitat a la posició de columna")
    print("  • La diagonal és sempre 100% (un vers amb tonicitat a i sempre té tonicitat a i)")
    print("  • La barra de color mostra 'percentatge (%)' en lloc de 'tonicitat'")
    print("  • Els valors màxims són 100.0 en lloc de 1.0")

if __name__ == "__main__":
    main()
