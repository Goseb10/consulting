// features/f4_comparator/f4.js

import { updateElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';
import { AGE_FINALE_DEFAUT, AGE_FINALE_LT, CURRENT_YEAR, AGE_TAXE } from '../../core/constants.js';
import { effectuerSimulation } from '../../core/simulationEngine.js';
import { getState, bindInput, bindCheckbox, updateState } from '../../core/store.js';

/**
 * Met à jour l'affichage des lignes de taxe (0% ou 2%), des toggles 80 ans
 * ET des labels d'âge de début pour les deux colonnes du comparateur
 */
function updateComparatorTaxInfo() {
    const t = translations[currentLang] || translations.fr;
    const state = getState();

    // --- Colonne 1 ---
    const type1 = state.f4_c1_type;
    const eltTax1 = document.getElementById('f3-c1-elt-taxe-info');
    const epTax1 = document.getElementById('f3-c1-ep-taxe-info');
    const ltToggleContainer1 = document.getElementById('f3-c1-lt-extension-container'); 
    const isExtended1 = state.f4_c1_extend_80; 
    const startAgeLabel1 = document.querySelector('#f3-col-1 label[for="f3-c1-start-age"]'); // Cible le label d'âge de début
    const yearsSpan1 = document.getElementById('f3-c1-duree-ans-text'); 
    
    if (type1 === 'long-terme') {
        if (eltTax1) eltTax1.style.display = 'flex';
        if (epTax1) epTax1.style.display = 'none';
        if (ltToggleContainer1) ltToggleContainer1.style.display = 'flex'; 

        // Utilise les nouvelles clés de traduction pour l'âge de début
        if (startAgeLabel1) startAgeLabel1.textContent = isExtended1 ? t.label_start_age_80_f4 : t.label_start_age_f4; 
        if (yearsSpan1) yearsSpan1.textContent = isExtended1 ? " " + t.span_years_80 : " " + t.span_years;

    } else { // 'pension'
        if (eltTax1) eltTax1.style.display = 'none';
        if (epTax1) epTax1.style.display = 'flex';
        if (ltToggleContainer1) { 
             ltToggleContainer1.style.display = 'none';
             const checkbox = document.getElementById('f3-c1-extension-80ans-toggle');
             if (checkbox && checkbox.checked) { 
                 checkbox.checked = false;
                 updateState('f4_c1_extend_80', false); 
             }
        }
        // Utilise la clé standard pour l'âge de début (cible 67 ans)
        if (startAgeLabel1) startAgeLabel1.textContent = t.label_start_age_f4; 
        if (yearsSpan1) yearsSpan1.textContent = " " + t.span_years;
    }

    // --- Colonne 2 ---
    const type2 = state.f4_c2_type;
    const eltTax2 = document.getElementById('f3-c2-elt-taxe-info');
    const epTax2 = document.getElementById('f3-c2-ep-taxe-info');
    const ltToggleContainer2 = document.getElementById('f3-c2-lt-extension-container'); 
    const isExtended2 = state.f4_c2_extend_80; 
    const startAgeLabel2 = document.querySelector('#f3-col-2 label[for="f3-c2-start-age"]'); // Cible le label d'âge de début
    const yearsSpan2 = document.getElementById('f3-c2-duree-ans-text'); 

    if (type2 === 'long-terme') {
        if (eltTax2) eltTax2.style.display = 'flex';
        if (epTax2) epTax2.style.display = 'none';
        if (ltToggleContainer2) ltToggleContainer2.style.display = 'flex'; 

        // Utilise les nouvelles clés de traduction pour l'âge de début
        if (startAgeLabel2) startAgeLabel2.textContent = isExtended2 ? t.label_start_age_80_f4 : t.label_start_age_f4;
        if (yearsSpan2) yearsSpan2.textContent = isExtended2 ? " " + t.span_years_80 : " " + t.span_years;

    } else { // 'pension'
        if (eltTax2) eltTax2.style.display = 'none';
        if (epTax2) epTax2.style.display = 'flex';
        if (ltToggleContainer2) { 
            ltToggleContainer2.style.display = 'none';
            const checkbox = document.getElementById('f3-c2-extension-80ans-toggle');
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
                updateState('f4_c2_extend_80', false); 
            }
        }
        // Utilise la clé standard pour l'âge de début (cible 67 ans)
        if (startAgeLabel2) startAgeLabel2.textContent = t.label_start_age_f4; 
        if (yearsSpan2) yearsSpan2.textContent = " " + t.span_years;
    }
}


/**
 * NOUVELLE FONCTION : Gère l'affichage des blocs UI pour le scénario
 */
function setupF4ScenarioUI() {
    const state = getState();
    const isStopSwitch = state.f4_scenario_stop_switch;
    const t = translations[currentLang] || translations.fr;

    // Récupérer les éléments de l'interface
    const stopSwitchGroup = document.getElementById('f3-c1-stop-switch-group'); // MODIFIÉ
    const versementGroup = document.getElementById('f3-c1-flux-group');
    const differenceLine = document.getElementById('f3-difference-line');
    const combinedResults = document.getElementById('f3-combined-results');
    const resultsTitle = document.getElementById('f3-results-title');

    if (isStopSwitch) {
        // --- Activer la vue "Stop & Switch" ---
        if (stopSwitchGroup) stopSwitchGroup.style.display = 'block'; // AFFICHER
        if (versementGroup) versementGroup.style.display = 'none'; // Masquer les versements C1
        
        if (differenceLine) differenceLine.style.display = 'none';
        if (combinedResults) combinedResults.style.display = 'block';
        if (resultsTitle) resultsTitle.textContent = t.h3_total_capital || "Capital Total Combiné";

    } else {
        // --- Activer la vue "Comparaison" par défaut ---
        if (stopSwitchGroup) stopSwitchGroup.style.display = 'none'; // MASQUER
        if (versementGroup) versementGroup.style.display = 'block'; // Afficher les versements C1
        
        if (differenceLine) differenceLine.style.display = 'block';
        if (combinedResults) combinedResults.style.display = 'none';
        if (resultsTitle) resultsTitle.textContent = t.h3_difference || "Différence";
    }
}


export function calculerComparaisonF3() {
    console.log("calculerComparaisonF3 déclenché");
    
    // Met à jour l'UI (labels, taxes, toggles) avant de calculer
    updateComparatorTaxInfo();

    try {
        const t = translations[currentLang] || translations.fr;
        const state = getState();
        
        // --- NOUVELLE LOGIQUE : Lire l'état du scénario ---
        const isStopSwitch = state.f4_scenario_stop_switch;

        // --- Paramètres Communs C1 ---
        const type1 = state.f4_c1_type;
        const currentAge1 = parseInt(state.f4_c1_start_age) || 0; // Âge actuel
        const anneeNaissance1 = CURRENT_YEAR - currentAge1;
        const versement1_base = parseFloat(state.f4_c1_versement) || 0;
        const rendement1 = parseFloat(state.f4_c1_rendement) || 0;
        const fraisEntree1 = parseFloat(state.f4_c1_frais_entree) || 0;
        const fraisCourant1 = parseFloat(state.f4_c1_frais_courant) || 0;
        const isExtended1 = state.f4_c1_extend_80;
        const finalAge1 = (type1 === 'long-terme' && isExtended1) ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;

        const paramsC1_Base = { 
            typeEpargne: type1, anneeNaissance: anneeNaissance1, 
            rendementAnnuel: rendement1, fraisEntreePct: fraisEntree1, 
            fraisCourantAnnuelPct: fraisCourant1, targetAge: finalAge1
        };

        // --- Paramètres Communs C2 ---
        const type2 = state.f4_c2_type;
        const currentAge2 = parseInt(state.f4_c2_start_age) || 0; // Âge actuel
        const anneeNaissance2 = CURRENT_YEAR - currentAge2;
        const versement2 = parseFloat(state.f4_c2_versement) || 0;
        const rendement2 = parseFloat(state.f4_c2_rendement) || 0;
        const fraisEntree2 = parseFloat(state.f4_c2_frais_entree) || 0;
        const fraisCourant2 = parseFloat(state.f4_c2_frais_courant) || 0;
        const isExtended2 = state.f4_c2_extend_80;
        const finalAge2 = (type2 === 'long-terme' && isExtended2) ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;
        
        const paramsC2_Base = { 
            typeEpargne: type2, anneeNaissance: anneeNaissance2, versementBrutMensuel: versement2, 
            rendementAnnuel: rendement2, fraisEntreePct: fraisEntree2, fraisCourantAnnuelPct: fraisCourant2, 
            targetAge: finalAge2, capitalInitial: 0
        };

        let result1, result2;
        let result_Precalc_data = null; // <-- MODIFIÉ: Pour stocker les résultats passés

        if (isStopSwitch) {
            // --- SCÉNARIO "STOP & SWITCH" ---
            
            // 1. Pré-calcul : Simuler C1 du début (original) jusqu'à AUJOURD'HUI
            const originalStartAge = parseInt(state.f4_c1_original_start_age) || 18;
            // Année de début de la simulation de pré-calcul
            const startYear_Precalc = anneeNaissance1 + originalStartAge;
            
            const params_Precalc = {
                ...paramsC1_Base,
                versementBrutMensuel: versement1_base,
                targetAge: currentAge1, // Simuler jusqu'à l'âge actuel
                capitalInitial: 0
            };
            // On simule en partant de l'année de début originale
            const result_Precalc = effectuerSimulation(params_Precalc, startYear_Precalc);
            result_Precalc_data = result_Precalc; // <-- MODIFIÉ: Stocker les résultats
            const capitalActuelC1 = result_Precalc.capitalFinalNet;
            
            // 2. Simuler C1 (Croissance seule) : d'AUJOURD'HUI jusqu'à 67 ans
            const params_C1_Growth = {
                ...paramsC1_Base,
                versementBrutMensuel: 0, // Arrêt des versements
                capitalInitial: capitalActuelC1, // Démarrer avec le capital calculé
                targetAge: finalAge1 // Simuler jusqu'à l'âge final
            };
            // On simule en partant de l'année actuelle
            result1 = effectuerSimulation(params_C1_Growth, CURRENT_YEAR);

            // 3. Simuler C2 (Nouveau Contrat) : d'AUJOURD'HUI jusqu'à 67 ans
            // On simule en partant de l'année actuelle
            result2 = effectuerSimulation(paramsC2_Base, CURRENT_YEAR);

            // Mettre à jour les champs de résultats combinés
            updateElement('f3-c1-final-only', result1.capitalFinalNet);
            updateElement('f3-c2-final-only', result2.capitalFinalNet);
            const combinedTotal = result1.capitalFinalNet + result2.capitalFinalNet;
            updateElement('f3-combined-capital', combinedTotal);

        } else {
            // --- SCÉNARIO "COMPARAISON" NORMAL ---
            
            // 1. Simuler C1 normally (d'AUJOURD'HUI à 67 ans)
            const params_C1_Normal = {
                ...paramsC1_Base,
                versementBrutMensuel: versement1_base,
                capitalInitial: 0,
                targetAge: finalAge1
            };
            result1 = effectuerSimulation(params_C1_Normal, CURRENT_YEAR);
            
            // 2. Simuler C2 normally (d'AUJOURD'HUI à 67 ans)
            result2 = effectuerSimulation(paramsC2_Base, CURRENT_YEAR);
            
            // Mettre à jour la différence
            const diff = result1.capitalFinalNet - result2.capitalFinalNet;
            updateElement('f3-difference-capital', diff);
            const diffEl = document.getElementById('f3-difference-capital');
            if (diffEl) {
                diffEl.classList.remove('positive', 'negative');
                if (diff > 0.01) {
                    diffEl.classList.add('positive');
                } else if (diff < -0.01) {
                    diffEl.classList.add('negative');
                }
            }
        }

        // --- Mise à jour de l'UI (partie commune) ---

        // Mettre à jour les infos de durée (C1)
        updateElement('f3-c1-duree-ans-info', result1.dureeAnnees.toFixed(0), false);
        // Mettre à jour les infos de durée (C2)
        updateElement('f3-c2-duree-ans-info', result2.dureeAnnees.toFixed(0), false);
        
        // Mettre à jour le texte du capital final (C1)
        const finalAgeKey1 = (finalAge1 === 80) ? 'chart_final_net_80' : 'chart_final_net';
        updateElement('f3-c1-final-capital-text', (t[finalAgeKey1] || "Capital Final Net").toUpperCase(), false);
        // Mettre à jour le texte du capital final (C2)
        const finalAgeKey2 = (finalAge2 === 80) ? 'chart_final_net_80' : 'chart_final_net';
        updateElement('f3-c2-final-capital-text', (t[finalAgeKey2] || "Capital Final Net").toUpperCase(), false);

        // Mettre à jour les labels de taxe (C1)
        const ageTaxe1 = result1.ageTaxe || AGE_TAXE;
        const labelTaxe1 = t.span_f3_tax.replace('{age}', ageTaxe1.toFixed(0));
        updateElement('f4-c1-tax-label', labelTaxe1, false);
        // Mettre à jour les labels de taxe (C2)
        const ageTaxe2 = result2.ageTaxe || AGE_TAXE;
        const labelTaxe2 = t.span_f3_tax.replace('{age}', ageTaxe2.toFixed(0));
        updateElement('f4-c2-tax-label', labelTaxe2, false);


        // --- MODIFIÉ: BLOC DE MISE À JOUR C1 ---
        const unit = currentLang === 'nl' ? 'jaar' : (currentLang === 'en' ? 'yrs' : 'ans');
        
        if (isStopSwitch && result_Precalc_data) {
            // Mode Stop & Switch: utilise les données de pré-calcul (passé) pour les totaux
            updateElement('f3-c1-duree-ans-total', `${result_Precalc_data.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
            updateElement('f3-c1-versement-brut-total', result_Precalc_data.capitalBrutPlaceTotal);
            updateElement('f3-c1-avantage-total', result_Precalc_data.avantageFiscalTotal);
            updateElement('f3-c1-capital-net-total', result_Precalc_data.capitalNetPlaceTotal);
            // La taxe et le capital final viennent de la simulation de CROISSANCE (future) (result1)
            updateElement('f3-c1-taxe-liberatoire', result1.taxeLiberatoire);
            updateElement('f3-c1-capital-final', result1.capitalFinalNet); 
        } else {
            // Mode Comparaison Normal: utilise result1 pour tout
            updateElement('f3-c1-duree-ans-total', `${result1.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
            updateElement('f3-c1-versement-brut-total', result1.capitalBrutPlaceTotal);
            updateElement('f3-c1-avantage-total', result1.avantageFiscalTotal);
            updateElement('f3-c1-capital-net-total', result1.capitalNetPlaceTotal);
            updateElement('f3-c1-taxe-liberatoire', result1.taxeLiberatoire);
            updateElement('f3-c1-capital-final', result1.capitalFinalNet);
        }
        // --- FIN DE LA MODIFICATION ---

        // Mettre à jour les résultats (Colonne 2)
        updateElement('f3-c2-duree-ans-total', `${result2.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
        updateElement('f3-c2-versement-brut-total', result2.capitalBrutPlaceTotal);
        updateElement('f3-c2-avantage-total', result2.avantageFiscalTotal);
        updateElement('f3-c2-capital-net-total', result2.capitalNetPlaceTotal);
        updateElement('f3-c2-taxe-liberatoire', result2.taxeLiberatoire);
        updateElement('f3-c2-capital-final', result2.capitalFinalNet);

    } catch (error) {
        console.error("Erreur majeure dans calculerComparaisonF3:", error);
    }
}

/**
 * Initialise la fonctionnalité F4 (Comparateur)
 */
export function initF4() {
    console.log("Initialisation F4 (Comparateur)...");

    // --- BINDINGS "STOP & SWITCH" ---
    bindCheckbox('f3-scenario-stop-switch', 'f4_scenario_stop_switch', () => {
        setupF4ScenarioUI(); // Change l'affichage
        calculerComparaisonF3(); // Relance le calcul
    });
    // MODIFIÉ: Lier le nouveau champ
    bindInput('f3-c1-original-start-age', 'f4_c1_original_start_age', calculerComparaisonF3);


    // --- BINDINGS COLONNE 1 ---
    bindInput('f3-c1-name', 'f4_c1_name'); 
    bindInput('f3-c1-type-epargne', 'f4_c1_type', calculerComparaisonF3);
    bindCheckbox('f3-c1-extension-80ans-toggle', 'f4_c1_extend_80', calculerComparaisonF3);
    bindInput('f3-c1-start-age', 'f4_c1_start_age', calculerComparaisonF3); // (Âge actuel C1)
    bindInput('f3-c1-versement-brut', 'f4_c1_versement', calculerComparaisonF3);
    bindInput('f3-c1-rendement', 'f4_c1_rendement', calculerComparaisonF3);
    bindInput('f3-c1-frais-entree', 'f4_c1_frais_entree', calculerComparaisonF3);
    bindInput('f3-c1-frais-courant', 'f4_c1_frais_courant', calculerComparaisonF3);

    // --- BINDINGS COLONNE 2 ---
    bindInput('f3-c2-name', 'f4_c2_name');
    bindInput('f3-c2-type-epargne', 'f4_c2_type', calculerComparaisonF3);
    bindCheckbox('f3-c2-extension-80ans-toggle', 'f4_c2_extend_80', calculerComparaisonF3);
    bindInput('f3-c2-start-age', 'f4_c2_start_age', calculerComparaisonF3); // (Âge actuel C2)
    bindInput('f3-c2-versement-brut', 'f4_c2_versement', calculerComparaisonF3);
    bindInput('f3-c2-rendement', 'f4_c2_rendement', calculerComparaisonF3);
    bindInput('f3-c2-frais-entree', 'f4_c2_frais_entree', calculerComparaisonF3);
    bindInput('f3-c2-frais-courant', 'f4_c2_frais_courant', calculerComparaisonF3);


    // Listener sur le bouton
    document.getElementById('f4-compare-button').addEventListener('click', calculerComparaisonF3);

    // Enregistrer pour les changements de langue
    registerOnLangChange(() => {
        setupF4ScenarioUI(); // Met à jour les textes des titres
        calculerComparaisonF3(); // Relance le calcul (met à jour les labels de taxe, etc.)
    });

    // Exécution initiale
    setupF4ScenarioUI(); // Définit l'état d'affichage initial
    calculerComparaisonF3(); // Lance le premier calcul
}