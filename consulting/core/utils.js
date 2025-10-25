// core/utils.js

export function formatMonetaire(nombre) {
    if (typeof nombre !== 'number' || isNaN(nombre) || !isFinite(nombre)) { return '0,00 €'; }
    // Utilisation de 'de-DE' pour avoir le format 1.234,56 € (point comme séparateur de milliers, virgule pour décimales)
    // Si 'fr-BE' est préféré (1.234,56 €) ou 'fr-FR' (1 234,56 €), ajustez ici.
    // 'de-DE' semble correspondre aux exemples 'xx.xxx,xx' (point pour milliers).
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nombre);
}

// Fonction pour mettre à jour un élément du DOM en toute sécurité
export function updateElement(id, value, isMonetary = true) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = isMonetary ? formatMonetaire(value) : value;
    } else {
        console.warn(`Element with ID "${id}" not found.`);
    }
}

export function updateInputElement(id, value) {
     const element = document.getElementById(id);
     if (element) {
         element.value = value;
     } else {
         console.warn(`Input element with ID "${id}" not found.`);
     }
}
