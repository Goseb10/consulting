// core/store.js

// 1. Définir l'état par défaut de tous les inputs de l'application
const defaultState = {
    // F1 - Pension / LT
    f1_type: 'pension',
    f1_extend_80: false,
    f1_birth_year: 2000,
    f1_versement: 87.50,
    f1_rendement: 5,
    f1_frais_entree: 3,
    f1_frais_courant: 0.85,

    // F2 - Non-Fiscal
    f2_initial: 0,
    f2_versement: 75,
    f2_rendement: 8,
    f2_duree: 10,

    // F3 - Inflation
    f3_montant: 1000,
    f3_duree: 10,
    f3_taux: 3,

    // F4 - Comparateur
    f4_c1_name: 'Belfius',
    f4_c1_type: 'pension',
    f4_c1_extend_80: false,
    f4_c1_birth_year: 2001,
    f4_c1_versement: 87.50,
    f4_c1_rendement: 2,
    f4_c1_frais_entree: 3,
    f4_c1_frais_courant: 1.25,
    f4_c2_name: 'AXA',
    f4_c2_type: 'pension',
    f4_c2_extend_80: false,
    f4_c2_birth_year: 2000,
    f4_c2_versement: 87.50,
    f4_c2_rendement: 5,
    f4_c2_frais_entree: 3,
    f4_c2_frais_courant: 0.85,

    // F5 - Mail
    f5_prenom: 'Prénom',
    f5_nom: 'Nom',
    f5_rdv_date: 'Mardi 4 mars',
    f5_rdv_time: '10h00',
    f5_langue: 'fr',
    f5_msci_rate: 8.53,
    f5_toggle_ep: true,
    f5_toggle_elt: false,
    f5_toggle_plci: false,
    f5_toggle_inami: false,
    f5_toggle_eip: false,
    f5_toggle_nonfiscal: false,
    f5_toggle_dela: false,
    f5_ep_mensualite: 87.50,
    f5_ep_birthyear: 2000,
    f5_elt_mensualite: 100.00,
    f5_elt_birthyear: 2000,
    f5_elt_extend_80: false,
    f5_dela_capital: 10000,
    f5_dela_prime: 25.00,
    f5_nonfiscal_mensualite: 100,
    f5_nonfiscal_birthyear: 2000
};

// 2. Initialiser l'état
let state = { ...defaultState };
const APP_STATE_KEY = 'consultingAppState';

// 3. Fonctions de gestion du state
function saveState() {
    // Ne pas sauvegarder si on est en mode visiteur
    if (document.body.classList.contains('mode-visitor')) {
        return;
    }
    try {
        localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde du state:", e);
    }
}

export function loadState() {
    // Ne pas charger si on est en mode visiteur
    if (document.body.classList.contains('mode-visitor')) {
        console.log("Mode visiteur: chargement du state depuis localStorage désactivé.");
        state = { ...defaultState };
        return;
    }
    
    try {
        const savedState = localStorage.getItem(APP_STATE_KEY);
        if (savedState) {
            state = { ...defaultState, ...JSON.parse(savedState) };
        } else {
            state = { ...defaultState };
        }
    } catch (e) {
        console.error("Erreur lors du chargement du state:", e);
        state = { ...defaultState };
    }
}

export function getState() {
    return state;
}

export function updateState(key, value) {
    if (key in state) {
        state[key] = value;
        saveState();
    } else {
        console.warn(`Clé de state inconnue: ${key}`);
    }
}

/**
 * Lie un champ <input> ou <select> au store.
 * @param {string} inputId - ID de l'élément DOM.
 * @param {string} stateKey - Clé dans l'objet state.
 * @param {function} [callback] - Fonction à appeler après la mise à jour (ex: un calculateur).
 */
export function bindInput(inputId, stateKey, callback) {
    const element = document.getElementById(inputId);
    if (!element) {
        console.warn(`Binding impossible: ID "${inputId}" non trouvé.`);
        return;
    }
    
    // 1. Charger la valeur du state dans l'input
    if (state[stateKey] !== undefined) {
        element.value = state[stateKey];
    }
    
    // 2. Écouter les changements de l'input pour mettre à jour le state
    const eventType = (element.tagName === 'SELECT') ? 'change' : 'input';
    element.addEventListener(eventType, (e) => {
        let value = e.target.value;
        if (element.type === 'number') {
            value = parseFloat(value) || 0;
        }
        updateState(stateKey, value);
        if (callback) callback();
    });
    
    // 3. Gérer le 'change' (pour les inputs number qui perdent le focus ou "Enter")
    if (element.type === 'number') {
         element.addEventListener('change', (e) => {
             const value = parseFloat(e.target.value) || 0;
             updateState(stateKey, value);
             if (callback) callback();
         });
    }
}

/**
 * Lie une <input type="checkbox"> au store.
 * @param {string} inputId - ID de l'élément DOM.
 * @param {string} stateKey - Clé dans l'objet state.
 * @param {function} [callback] - Fonction à appeler après la mise à jour (ex: un calculateur).
 */
export function bindCheckbox(inputId, stateKey, callback) {
    const element = document.getElementById(inputId);
    if (!element) {
        console.warn(`Binding impossible: ID "${inputId}" non trouvé.`);
        return;
    }
    
    // 1. Charger la valeur du state
    if (state[stateKey] !== undefined) {
        element.checked = state[stateKey];
    }
    
    // 2. Écouter les changements
    element.addEventListener('change', (e) => {
        updateState(stateKey, e.target.checked);
        if (callback) callback();
    });
}