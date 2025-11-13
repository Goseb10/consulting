// features/f4_comparator/f4.js

import { updateElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';
import { AGE_FINALE_DEFAUT, AGE_FINALE_LT, CURRENT_YEAR, AGE_TAXE } from '../../core/constants.js';
import { effectuerSimulation } from '../../core/simulationEngine.js';

// Importer le store
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


export function calculerComparaisonF3() {
    console.log("calculerComparaisonF3 déclenché avec âge de début");
    
    // Met à jour l'UI (labels, taxes, toggles) avant de calculer
    updateComparatorTaxInfo();

    try {
        const t = translations[currentLang] || translations.fr;
        const state = getState();

        // --- Compagnie 1 ---
        const type1 = state.f4_c1_type;
        const startAge1 = parseInt(state.f4_c1_start_age) || 0; // Lire l'âge de début
        const annee1 = CURRENT_YEAR - startAge1; // Calculer l'année de naissance
        const versement1 = parseFloat(state.f4_c1_versement) || 0;
        const rendement1 = parseFloat(state.f4_c1_rendement) || 0;
        const fraisEntree1 = parseFloat(state.f4_c1_frais_entree) || 0;
        const fraisCourant1 = parseFloat(state.f4_c1_frais_courant) || 0;
        const isExtended1 = state.f4_c1_extend_80;
        const finalAge1 = (type1 === 'long-terme' && isExtended1) ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;
        
        // --- Compagnie 2 ---
        const type2 = state.f4_c2_type;
        const startAge2 = parseInt(state.f4_c2_start_age) || 0; // Lire l'âge de début
        const annee2 = CURRENT_YEAR - startAge2; // Calculer l'année de naissance
        const versement2 = parseFloat(state.f4_c2_versement) || 0;
        const rendement2 = parseFloat(state.f4_c2_rendement) || 0;
        const fraisEntree2 = parseFloat(state.f4_c2_frais_entree) || 0;
        const fraisCourant2 = parseFloat(state.f4_c2_frais_courant) || 0;
        const isExtended2 = state.f4_c2_extend_80;
        const finalAge2 = (type2 === 'long-terme' && isExtended2) ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;

        // Créer les paramètres de simulation (passe l'année de naissance calculée)
        const params1 = { 
            typeEpargne: type1, anneeNaissance: annee1, versementBrutMensuel: versement1, 
            rendementAnnuel: rendement1, fraisEntreePct: fraisEntree1, fraisCourantAnnuelPct: fraisCourant1, 
            targetAge: finalAge1 
        };
        const params2 = { 
            typeEpargne: type2, anneeNaissance: annee2, versementBrutMensuel: versement2, 
            rendementAnnuel: rendement2, fraisEntreePct: fraisEntree2, fraisCourantAnnuelPct: fraisCourant2, 
            targetAge: finalAge2 
        };
        
        // Exécuter les simulations
        const result1 = effectuerSimulation(params1, CURRENT_YEAR);
        const result2 = effectuerSimulation(params2, CURRENT_YEAR);

        // Mettre à jour les infos de durée
        updateElement('f3-c1-duree-ans-info', result1.dureeAnnees.toFixed(0), false);
        updateElement('f3-c2-duree-ans-info', result2.dureeAnnees.toFixed(0), false);
        
        // Mettre à jour le texte du capital final
        const finalAgeKey1 = (finalAge1 === 80) ? 'chart_final_net_80' : 'chart_final_net';
        const finalAgeKey2 = (finalAge2 === 80) ? 'chart_final_net_80' : 'chart_final_net';
        updateElement('f3-c1-final-capital-text', (t[finalAgeKey1] || "Capital Final Net").toUpperCase(), false);
        updateElement('f3-c2-final-capital-text', (t[finalAgeKey2] || "Capital Final Net").toUpperCase(), false);

        // Mettre à jour les labels de taxe
        const ageTaxe1 = result1.ageTaxe || AGE_TAXE;
        const labelTaxe1 = t.span_f3_tax.replace('{age}', ageTaxe1.toFixed(0));
        updateElement('f4-c1-tax-label', labelTaxe1, false);
        
        const ageTaxe2 = result2.ageTaxe || AGE_TAXE;
        const labelTaxe2 = t.span_f3_tax.replace('{age}', ageTaxe2.toFixed(0));
        updateElement('f4-c2-tax-label', labelTaxe2, false);

        // Mettre à jour les résultats (Colonne 1)
        const unit = currentLang === 'nl' ? 'jaar' : (currentLang === 'en' ? 'yrs' : 'ans');
        updateElement('f3-c1-duree-ans-total', `${result1.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
        updateElement('f3-c1-versement-brut-total', result1.capitalBrutPlaceTotal);
        updateElement('f3-c1-avantage-total', result1.avantageFiscalTotal);
        updateElement('f3-c1-capital-net-total', result1.capitalNetPlaceTotal);
        updateElement('f3-c1-taxe-liberatoire', result1.taxeLiberatoire);
        updateElement('f3-c1-capital-final', result1.capitalFinalNet);

        // Mettre à jour les résultats (Colonne 2)
        updateElement('f3-c2-duree-ans-total', `${result2.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
        updateElement('f3-c2-versement-brut-total', result2.capitalBrutPlaceTotal);
        updateElement('f3-c2-avantage-total', result2.avantageFiscalTotal);
        updateElement('f3-c2-capital-net-total', result2.capitalNetPlaceTotal);
        updateElement('f3-c2-taxe-liberatoire', result2.taxeLiberatoire);
        updateElement('f3-c2-capital-final', result2.capitalFinalNet);
        
        // Mettre à jour la différence
        const diff = result1.capitalFinalNet - result2.capitalFinalNet;
        updateElement('f3-difference-capital', diff);
        
        // Appliquer la couleur à la différence
        const diffEl = document.getElementById('f3-difference-capital');
        if (diffEl) {
            diffEl.classList.remove('positive', 'negative');
            if (diff > 0.01) {
                diffEl.classList.add('positive');
            } else if (diff < -0.01) {
                diffEl.classList.add('negative');
            }
        }

    } catch (error) {
        console.error("Erreur majeure dans calculerComparaisonF3:", error);
    }
}

/**
 * Initialise la fonctionnalité F4 (Comparateur)
 */
export function initF4() {
    console.log("Initialisation F4 (Comparateur)...");

    // Lier les inputs au store
    // Colonne 1
    bindInput('f3-c1-name', 'f4_c1_name'); 
    bindInput('f3-c1-type-epargne', 'f4_c1_type', calculerComparaisonF3);
    bindCheckbox('f3-c1-extension-80ans-toggle', 'f4_c1_extend_80', calculerComparaisonF3);
    bindInput('f3-c1-start-age', 'f4_c1_start_age', calculerComparaisonF3); // MODIFIÉ
    bindInput('f3-c1-versement-brut', 'f4_c1_versement', calculerComparaisonF3);
    bindInput('f3-c1-rendement', 'f4_c1_rendement', calculerComparaisonF3);
    bindInput('f3-c1-frais-entree', 'f4_c1_frais_entree', calculerComparaisonF3);
    bindInput('f3-c1-frais-courant', 'f4_c1_frais_courant', calculerComparaisonF3);

    // Colonne 2
    bindInput('f3-c2-name', 'f4_c2_name');
    bindInput('f3-c2-type-epargne', 'f4_c2_type', calculerComparaisonF3);
    bindCheckbox('f3-c2-extension-80ans-toggle', 'f4_c2_extend_80', calculerComparaisonF3);
    bindInput('f3-c2-start-age', 'f4_c2_start_age', calculerComparaisonF3); // MODIFIÉ
    bindInput('f3-c2-versement-brut', 'f4_c2_versement', calculerComparaisonF3);
    bindInput('f3-c2-rendement', 'f4_c2_rendement', calculerComparaisonF3);
    bindInput('f3-c2-frais-entree', 'f4_c2_frais_entree', calculerComparaisonF3);
    bindInput('f3-c2-frais-courant', 'f4_c2_frais_courant', calculerComparaisonF3);


    // Listener sur le bouton
    document.getElementById('f4-compare-button').addEventListener('click', calculerComparaisonF3);

    // Enregistrer pour les changements de langue
    registerOnLangChange(calculerComparaisonF3);

    // Premier calcul
    calculerComparaisonF3();
}