// core/i18n.js - VERSION PURIFIÉE

// 1. L'objet des traductions est maintenant chargé dynamiquement
export let translations = {};
export let currentLang = 'fr'; // Langue par défaut
export const onLangChangeCallbacks = []; // Fonctions à appeler lors du changement de langue

/**
 * Charge un fichier de traduction (lang/fr.json, etc.)
 * @param {string} lang - 'fr', 'nl', 'en'
 */
async function loadTranslations(lang) {
    // Si déjà chargé, ne rien faire
    if (translations[lang] && Object.keys(translations[lang]).length > 0) {
        return translations[lang];
    }
    
    try {
        const response = await fetch(`lang/${lang}.json?v=1.0`); // ?v=1.0 pour éviter les problèmes de cache
        if (!response.ok) {
            throw new Error(`Impossible de charger le fichier de langue: ${lang}.json`);
        }
        translations[lang] = await response.json();
        console.log(`Traductions pour "${lang}" chargées.`);
        return translations[lang];
    } catch (e) {
        console.error("Erreur de chargement des traductions:", e);
        translations[lang] = {}; // Mettre un objet vide en cas d'échec
        return translations[lang];
    }
}

/**
 * Enregistre une fonction à appeler après un changement de langue.
 * @param {function} callback
 */
export function registerOnLangChange(callback) {
    onLangChangeCallbacks.push(callback);
}

/**
 * Applique les traductions statiques au DOM
 */
export function applyTranslations() {
    const t = translations[currentLang];
    if (!t) { console.error("Traductions non trouvées pour:", currentLang); return; }

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');

        // Exclure les textes gérés dynamiquement par les fonctions de calcul (inflation summary)
        if (key === 'p_summary_f3') return;
        
        // Exclure les labels de taxe qui seront gérés par les calculateurs
        if (key === 'span_tax_levied' || key === 'span_f3_tax') return;
        // Exclure les labels de graphiques qui seront gérés par les calculateurs
        if (['chart_evolution', 'chart_avant_taxe', 'chart_apres_taxe'].includes(key)) return;
        // Exclure les labels d'âge de début F4 qui seront gérés par le calculateur
        if (['label_start_age_f4', 'label_start_age_80_f4'].includes(key)) return;
        
        // MODIFICATION : Exclure les clés F2 (non-fiscal) qui sont maintenant dynamiques
        if (key === 'span_total_invested' || key === 'span_final_capital_f2') {
             // Ces clés sont obsolètes, on les remplace par les nouvelles clés
             if (key === 'span_total_invested' && t['span_total_invested_brut']) {
                 el.textContent = t['span_total_invested_brut'];
             }
             if (key === 'span_final_capital_f2' && t['span_final_capital_net_f2']) {
                 el.textContent = t['span_final_capital_net_f2'];
             }
             return; 
        }


        const isDynamicLabelF1 = ['label_birth_year', 'span_years'].includes(key);
        // MODIFIÉ: S'assurer que le label dynamique de F1 n'écrase pas le nouveau label F4
        if (isDynamicLabelF1 && el.getAttribute('for') === 'annee-naissance' && document.getElementById('type-epargne')?.value === 'long-terme') return; // Vérifier le 'for' pour cibler le bon label
        if (key === 'f4_label_birthyear_no_client' && el.getAttribute('for') !== 'mail-client-birthyear') return; // Ne pas appliquer la clé F4 au label F1

        if (t[key] !== undefined) {
            try {
                if (el.tagName === 'TITLE') { el.textContent = t[key]; }
                else if (el.tagName === 'OPTION' && el.parentElement && el.parentElement.id !== 'language-selector') { el.textContent = t[key]; }
                else if (el.tagName !== 'SELECT' && el.tagName !== 'INPUT') {
                    // Cas spécifique pour span_duration dans F1 ou F3
                    if (el.parentElement && el.parentElement.classList.contains('info-calculated-duration') && (key === 'span_duration' || key === 'span_f3_duration')) {
                        const yearsEl = el.parentElement.querySelector('[data-key="span_years"]');
                        el.textContent = t[key];
                        if (yearsEl && t.span_years) yearsEl.textContent = " " + t.span_years;
                    }
                    // Cas spécifique pour span_future_needed dans F2 (Inflation)
                    else if (key === 'span_future_needed') {
                         if (el.childNodes.length > 0 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                              el.childNodes[0].nodeValue = t[key]; // Met à jour le texte avant le span interne
                         } else {
                              el.textContent = t[key];
                              const spanYears = document.createElement('span');
                              spanYears.id = 'inflation-result-years';
                              el.appendChild(spanYears);
                              if (!el.textContent.includes(currentLang === 'nl' ? ' jaar' : (currentLang === 'en' ? ' years' : ' ans'))) {
                                    el.appendChild(document.createTextNode(currentLang === 'nl' ? ' jaar' : (currentLang === 'en' ? ' years' : ' ans')));
                              }
                         }
                    }
                    // Ne pas écraser les spans dynamiques F1
                    else if (key !== 'span_years') {
                         el.textContent = t[key];
                    }
                }
            } catch (e) { console.error(`Erreur traduction clé "${key}":`, e, el); }
        } else {
             // Optionnel: Avertir si une clé manque dans la langue courante
             // console.warn(`Clé de traduction manquante pour "${key}" en langue "${currentLang}"`);
        }
    });
}

/**
 * Définit la langue, la charge si nécessaire, et met à jour l'application
 * @param {string} lang 'fr', 'nl', or 'en'
 * @param {boolean} [runCallbacks=true] - Faut-il exécuter les callbacks (calculateurs) ?
 */
export async function setLanguage(lang, runCallbacks = true) {
    if (!lang) lang = 'fr';
    
    try {
        // Charger les traductions si elles n'existent pas encore
        await loadTranslations(lang);
    } catch (e) {
        console.error(`Échec du chargement de ${lang}, retour au français.`, e);
        // Tenter de charger le français en fallback
        await loadTranslations('fr');
        lang = 'fr';
    }
    
    currentLang = lang;

    // Mettre à jour la classe active sur les boutons
    document.querySelectorAll('.flag-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        }
    });

    applyTranslations(); // Applique les traductions statiques AVANT

    // Relancer tous les calculateurs enregistrés
    if (runCallbacks) {
        console.log(`Langue changée en ${lang}, rafraîchissement des modules...`);
        onLangChangeCallbacks.forEach(callback => {
            try {
                callback();
            } catch (e) {
                console.error("Erreur lors du rappel de changement de langue :", e, callback);
            }
        });
    }
}