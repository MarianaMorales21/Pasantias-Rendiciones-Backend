/**
 * Convierte un número a su representación en letras en español.
 * Portado de la función numero_a_letras() del sistema legacy PHP.
 */

const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];

const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function numeroALetras(numero) {
    if (numero === 0) return 'cero';
    if (numero < 0) return 'menos ' + numeroALetras(Math.abs(numero));

    let letras = '';

    if (numero >= 1000000) {
        const millones = Math.floor(numero / 1000000);
        if (millones === 1) {
            letras += 'un millón';
        } else {
            letras += numeroALetras(millones) + ' millones';
        }
        const resto = numero - (millones * 1000000);
        if (resto > 0) {
            letras += ' ' + numeroALetras(resto);
        }
    } else if (numero >= 1000) {
        const miles = Math.floor(numero / 1000);
        if (miles === 1) {
            letras += 'mil';
        } else {
            letras += numeroALetras(miles) + ' mil';
        }
        const resto = numero - (miles * 1000);
        if (resto > 0) {
            letras += ' ' + numeroALetras(resto);
        }
    } else if (numero === 100) {
        letras = 'cien';
    } else if (numero < 20) {
        letras += unidades[numero];
    } else if (numero < 100) {
        letras += decenas[Math.floor(numero / 10)];
        const resto = numero % 10;
        if (resto) {
            letras += ' y ' + unidades[resto];
        }
    } else {
        letras += centenas[Math.floor(numero / 100)];
        const resto = numero % 100;
        if (resto) {
            letras += ' ' + numeroALetras(resto);
        }
    }

    return letras;
}

/**
 * Convierte un número con decimales a letras.
 * Ej: 562597.00 → "quinientos sesenta y dos mil quinientos noventa y siete con cero centavos"
 */
export function numeroALetrasConDecimales(numero) {
    const parteEntera = Math.floor(numero);
    const parteDecimal = Math.round((numero - parteEntera) * 100);

    const parteEnteraLetras = numeroALetras(parteEntera);
    const parteDecimalLetras = numeroALetras(parteDecimal);

    if (parteDecimal === 0) {
        return parteEnteraLetras + ' con cero centavos';
    }
    return parteEnteraLetras + ' con ' + parteDecimalLetras + ' centavos';
}

/**
 * Formatea un número al estilo venezolano: 591.895,63
 */
export function formatearMonto(numero) {
    return Number(numero).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
