// core/store.js

import { onLangChangeCallbacks } from './i18n.js';

// 1. Définir l'état par défaut de tous les inputs de l'application
const defaultState = {
    // F1 - Pension / LT
    f1_type: 'pension',
    f1_target_age: 67,
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
    f2_frais_versement: 3.0, 
    f2_frais_gestion: 0.85,

    // F3 - Inflation
    f3_montant: 1000,
    f3_duree: 10,
    f3_taux: 3,

    // F4 - Comparateur
    f4_scenario_stop_switch: false,
    f4_c1_name: 'Belfius',
    f4_c1_type: 'pension',
    f4_c1_target_age: 67,
    f4_c1_start_age: 25, 
    f4_c1_original_start_age: 25,
    f4_c1_versement: 87.50,
    f4_c1_rendement: 2,
    f4_c1_frais_entree: 3,
    f4_c1_frais_courant: 1.25,
    f4_c2_name: 'AXA',
    f4_c2_type: 'pension',
    f4_c2_target_age: 67,
    f4_c2_start_age: 25, 
    f4_c2_versement: 87.50,
    f4_c2_rendement: 5,
    f4_c2_frais_entree: 3,
    f4_c2_frais_courant: 0.85,

    // F5 - Mail
    f5_prenom: 'Prénom',
    f5_nom: 'Nom',
    f5_email: 'client@email.com',
    f5_rdv_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    f5_rdv_time: '10:00',
    f5_rdv_tbd: false, 
    f5_langue: 'fr',
    f5_msci_rate: 8.53,
    f5_toggle_ep: true,
    f5_toggle_elt: false,
    f5_toggle_plci: false,
    f5_toggle_inami: false,
    f5_toggle_eip: false,
    f5_toggle_nonfiscal: false,
    f5_toggle_dela: false,
    f5_toggle_enfant: false,
    f5_children_count: 0,
    f5_children_data: [],
    f5_ep_mensualite: 87.50,
    f5_ep_birthyear: 2000,
    f5_elt_mensualite: 100.00,
    f5_elt_birthyear: 2000,
    f5_elt_target_age: 67,
    f5_dela_capital: 10000,
    f5_dela_prime: 25.00,
    f5_nonfiscal_mensualite: 100,
    f5_nonfiscal_birthyear: 2000,
};

// 2. Initialiser l'état
let state = { ...defaultState };
const APP_STATE_KEY = 'consultingAppState';
const boundElements = []; 

// 3. Fonctions de gestion du state
function saveState() {
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
    if (document.body.classList.contains('mode-visitor')) {
        console.log("Mode visiteur: chargement du state depuis localStorage désactivé.");
        state = { ...defaultState };
        return;
    }
    
    try {
        const savedState = localStorage.getItem(APP_STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            state = { ...defaultState, ...parsed };

            // Nettoyages des clés obsolètes liées aux checkbox 80 ans
            delete state.f1_extend_80;
            delete state.f4_c1_extend_80;
            delete state.f4_c2_extend_80;
            delete state.f5_elt_extend_80;

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
        if (key in defaultState) {
             state[key] = value;
             saveState();
        } else {
            console.warn(`Clé de state inconnue: ${key}`);
        }
    }
}

export function bindInput(inputId, stateKey, callback) {
    const element = document.getElementById(inputId);
    if (!element) {
        console.warn(`Binding impossible: ID "${inputId}" non trouvé.`);
        return;
    }
    
    boundElements.push({ element, stateKey, type: 'input' });
    
    if (state[stateKey] !== undefined) {
        element.value = state[stateKey];
    }
    
    const eventType = (element.tagName === 'SELECT' || element.type === 'number') ? 'change' : 'input';
    element.addEventListener(eventType, (e) => {
        let value = e.target.value;
        if (element.type === 'number') {
             const parsedValue = parseFloat(value);
             value = isNaN(parsedValue) ? 0 : parsedValue; 
        }
        updateState(stateKey, value);
        if (callback) callback();
    });
    
    if (element.type === 'number') {
         element.addEventListener('change', (e) => {
             const value = parseFloat(e.target.value); 
             const finalValue = isNaN(value) ? 0 : value;
             if (element.value !== finalValue.toString()) {
                  element.value = finalValue;
             }
             updateState(stateKey, finalValue);
             if (callback) callback();
         });
    }
}

export function bindCheckbox(inputId, stateKey, callback) {
    const element = document.getElementById(inputId);
    if (!element) {
        console.warn(`Binding impossible: ID "${inputId}" non trouvé.`);
        return;
    }
    
    boundElements.push({ element, stateKey, type: 'checkbox' });
    
    if (state[stateKey] !== undefined) {
        element.checked = state[stateKey];
    }
    
    element.addEventListener('change', (e) => {
        updateState(stateKey, e.target.checked);
        if (callback) callback();
    });
}

export function resetStateToDefault() {
    console.log("Resetting state to default for visitor...");
    state = { ...defaultState };
    
    boundElements.forEach(binding => {
        const { element, stateKey, type } = binding;
        if (state[stateKey] !== undefined) {
            if (type === 'checkbox') {
                element.checked = state[stateKey];
            } else {
                element.value = state[stateKey];
            }
        }
    });
    
    console.log("Reset: Triggering all module calculations...");
    onLangChangeCallbacks.forEach(callback => {
        try {
            callback();
        } catch (e) {
            console.error("Erreur lors du rappel de recalcul :", e, callback);
        }
    });
}
