def eliminar_saltos_linea(archivo_entrada, archivo_salida):
    with open(archivo_entrada, 'r', encoding='utf-8') as f:
        texto = f.read()
    
    # Eliminar saltos de línea y unir todo
    texto_continuo = texto.replace('\n', ' ').replace('\r', ' ')
    
    # Eliminar espacios múltiples
    while '  ' in texto_continuo:
        texto_continuo = texto_continuo.replace('  ', ' ')
    
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        f.write(texto_continuo)

# Usar la función
eliminar_saltos_linea('el_codigo.txt', 'el_codigo1.txt')