// features/f5_mail/f5.js - VERSION MISE À JOUR

import { CURRENT_YEAR, AGE_FINALE_DEFAUT, AGE_FINALE_LT, FRAIS_DEFAUT } from '../../core/constants.js';
import { emailTemplates } from '../../core/emailTemplates.js'; 
import { registerOnLangChange } from '../../core/i18n.js';
import { effectuerSimulation } from '../../core/simulationEngine.js'; 

// NOUVEAU: Importer le store
import { getState, bindInput, bindCheckbox } from '../../core/store.js';


/**
 * Calcule le capital final et le capital investi pour une épargne non fiscale.
 * (Fonction interne inchangée)
 */
function calculateNonFiscal(monthlyPayment, years) {
    // ... (votre fonction calculateNonFiscal reste inchangée)
    const P_monthly = parseFloat(monthlyPayment);
    const t = parseInt(years);
    const annualRatePct = 8.0; // Taux annuel en percentage

    if (isNaN(P_monthly) || P_monthly < 0 || isNaN(t) || t <= 0) {
        return { finalCapital: 0, investedCapital: 0 };
    }

    const monthlyRate = Math.pow(1 + (annualRatePct / 100), 1 / 12) - 1;
    let currentCapital = 0; 
    const totalMonths = t * 12;
    const investedCapital = P_monthly * totalMonths; 

    for (let month = 1; month <= totalMonths; month++) {
        currentCapital += P_monthly;
        currentCapital *= (1 + monthlyRate);
    }

    return {
        finalCapital: currentCapital,
        investedCapital: investedCapital
    };
}


/**
 * Génère l'aperçu de l'email
 */
export function genererEmail() {
    console.log("Génération email...");
    try {
        // NOUVEAU: Lire toutes les informations depuis le store
        const state = getState();

        const prenom = state.f5_prenom || "Prénom";
        const nom = state.f5_nom || "Nom";
        const rdvDate = state.f5_rdv_date || "Mardi 4 mars";
        const rdvTime = state.f5_rdv_time || "10h00";
        const delaCapital = state.f5_dela_capital || 10000;
        const delaPrime = state.f5_dela_prime || 25.00;
        const nonFiscalMensualite = state.f5_nonfiscal_mensualite || 0;
        const nonFiscalBirthYear = state.f5_nonfiscal_birthyear || CURRENT_YEAR;
        let nonFiscalAge = CURRENT_YEAR - parseInt(nonFiscalBirthYear);
         if (isNaN(nonFiscalAge) || nonFiscalAge < 0) {
            nonFiscalAge = 0; 
         }
        const epMensualite = parseFloat(state.f5_ep_mensualite) || 0;
        const epBirthYear = parseInt(state.f5_ep_birthyear) || CURRENT_YEAR;
        const eltMensualite = parseFloat(state.f5_elt_mensualite) || 0;
        const eltBirthYear = parseInt(state.f5_elt_birthyear) || CURRENT_YEAR;
        const eltExtend80 = state.f5_elt_extend_80;
        const msciRate = parseFloat(state.f5_msci_rate) || 8.53;
        const mailLang = state.f5_langue || 'fr';
        
        // Cases à cocher
        const includeEP = state.f5_toggle_ep;
        const includeELT = state.f5_toggle_elt;
        const includePLCI = state.f5_toggle_plci;
        const includeINAMI = state.f5_toggle_inami;
        const includeEIP = state.f5_toggle_eip;
        const includeNonFiscal = state.f5_toggle_nonfiscal;
        const includeDela = state.f5_toggle_dela;
        
        // Logique de formatage (inchangée)
        const t = emailTemplates[mailLang] || emailTemplates.fr; 
        const locale = 'de-DE'; 
        const formatMailMonetaire = (num) => {
            if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
                 return '0,00 €';
            }
            return new Intl.NumberFormat(locale, { 
                style: 'currency', 
                currency: 'EUR', 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }).format(num);
        };

        // --- Simulations (inchangées) ---
        const res10 = calculateNonFiscal(nonFiscalMensualite, 10);
        const res20 = calculateNonFiscal(nonFiscalMensualite, 20);
        const res30 = calculateNonFiscal(nonFiscalMensualite, 30);

        let epData = {}; 
        if (includeEP) {
            const epParams = {
                anneeNaissance: epBirthYear,
                versementBrutMensuel: epMensualite,
                typeEpargne: 'pension',
                rendementAnnuel: 5.0,
                fraisEntreePct: FRAIS_DEFAUT.pension.fraisEntree,
                fraisCourantAnnuelPct: FRAIS_DEFAUT.pension.fraisCourant,
                targetAge: AGE_FINALE_DEFAUT
            };
            epData = effectuerSimulation(epParams, CURRENT_YEAR);
            epData.targetAge = AGE_FINALE_DEFAUT; 
        }
        
        let eltData = {}; 
        if (includeELT) {
            const eltTargetAge = eltExtend80 ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;
            const eltParams = {
                anneeNaissance: eltBirthYear,
                versementBrutMensuel: eltMensualite,
                typeEpargne: 'long-terme',
                rendementAnnuel: 5.0,
                fraisEntreePct: FRAIS_DEFAUT['long-terme'].fraisEntree,
                fraisCourantAnnuelPct: FRAIS_DEFAUT['long-terme'].fraisCourant,
                targetAge: eltTargetAge
            };
            eltData = effectuerSimulation(eltParams, CURRENT_YEAR);
            eltData.targetAge = eltTargetAge; 
        }


        // --- Construction HTML (inchangée) ---
        let html = '';
        html += t.intro(prenom, nom);
        if (includeEP) html += t.ep(epData, formatMailMonetaire); 
        if (includeELT) html += t.elt(eltData, formatMailMonetaire);
        if (includeEP || includeELT) html += t.ep_elt_common(msciRate, formatMailMonetaire); 
        if (includePLCI) html += t.plci;
        if (includeINAMI) html += t.inami;
        if (includeEIP) html += t.eip;
        if (includeNonFiscal) html += t.nonfiscal(nonFiscalMensualite, nonFiscalAge, res10, res20, res30, formatMailMonetaire);
        if (includeDela) html += t.dela(delaCapital, delaPrime, formatMailMonetaire);
        html += t.rdv(rdvDate, rdvTime);
        html += `<ul style="margin-top: 10px; margin-bottom: 15px; padding-left: 20px; list-style-type: disc;">`;
        html += `<li>${t.docs_base}</li>`; 
        if (includeEIP) html += `<li>${t.docs_eip}</li>`; 
        html += `</ul>`;
        html += t.outro; 

        // --- Injection (inchangée) ---
        const previewContainer = document.getElementById('email-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = html;
        } else {
            console.error("Conteneur d'aperçu 'email-preview-container' non trouvé.");
        }

    } catch (e) {
        console.error("Erreur lors de la génération de l'email:", e);
        const previewContainer = document.getElementById('email-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = "<p style='color: red;'>Une erreur est survenue.</p>";
        }
    }
}

/**
 * Copie le contenu HTML de l'aperçu dans le presse-papiers.
 * (Fonction inchangée)
 */
function copierEmailHTML() {
    const previewContainer = document.getElementById('email-preview-container');
    const feedback = document.getElementById('copy-feedback');
    if (!previewContainer || !feedback) return;

    try {
        // ... (votre logique de copie reste inchangée)
        const range = document.createRange();
        range.selectNode(previewContainer);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();

        const feedbackText = {
            fr: "Copié !",
            nl: "Gekopieerd!",
            en: "Copied!"
        }[getState().f5_langue || 'fr']; // Lire la langue depuis le state

        feedback.textContent = feedbackText; 
        feedback.style.color = "var(--secondary-color)"; 
        feedback.style.display = 'inline';
        setTimeout(() => { feedback.style.display = 'none'; }, 2000);

    } catch (e) {
        // ... (votre gestion d'erreur reste inchangée)
        console.error("Échec copie HTML : ", e);
        const feedbackText = {
            fr: "Échec!",
            nl: "Mislukt!",
            en: "Failed!"
        }[getState().f5_langue || 'fr']; // Lire la langue depuis le state
        feedback.textContent = feedbackText;
        feedback.style.color = "red"; 
        feedback.style.display = 'inline';
        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    }
}


/**
 * Initialise la fonctionnalité F5 (Générateur de Mail)
 */
export function initF5() {
    console.log("Initialisation F5 (Mail)...");

    // NOUVEAU: Lier tous les inputs et checkboxes au store
    // Le callback `genererEmail` est appelé à chaque fois
    bindInput('mail-client-prenom', 'f5_prenom', genererEmail);
    bindInput('mail-client-nom', 'f5_nom', genererEmail);
    bindInput('mail-rdv-date', 'f5_rdv_date', genererEmail);
    bindInput('mail-rdv-time', 'f5_rdv_time', genererEmail);
    bindInput('mail-langue', 'f5_langue', genererEmail);
    bindInput('mail-common-mci-rate', 'f5_msci_rate', genererEmail);

    // Toggles de section
    bindCheckbox('toggle-ep', 'f5_toggle_ep', genererEmail);
    bindCheckbox('toggle-elt', 'f5_toggle_elt', genererEmail);
    bindCheckbox('toggle-plci', 'f5_toggle_plci', genererEmail);
    bindCheckbox('toggle-inami', 'f5_toggle_inami', genererEmail);
    bindCheckbox('toggle-eip', 'f5_toggle_eip', genererEmail);
    bindCheckbox('toggle-nonfiscal', 'f5_toggle_nonfiscal', genererEmail);
    bindCheckbox('toggle-dela', 'f5_toggle_dela', genererEmail);
    
    // Options EP
    bindInput('mail-ep-mensualite', 'f5_ep_mensualite', genererEmail);
    bindInput('mail-ep-birthyear', 'f5_ep_birthyear', genererEmail);
    
    // Options ELT
    bindInput('mail-elt-mensualite', 'f5_elt_mensualite', genererEmail);
    bindInput('mail-elt-birthyear', 'f5_elt_birthyear', genererEmail);
    bindCheckbox('mail-elt-extend-80ans', 'f5_elt_extend_80', genererEmail);

    // Options Dela
    bindInput('mail-dela-capital', 'f5_dela_capital', genererEmail);
    bindInput('mail-dela-prime', 'f5_dela_prime', genererEmail);

    // Options Non-Fiscal
    bindInput('mail-nonfiscal-mensualite', 'f5_nonfiscal_mensualite', genererEmail);
    bindInput('mail-nonfiscal-birthyear', 'f5_nonfiscal_birthyear', genererEmail);


    // --- Logique d'affichage conditionnel (inchangée) ---
    const setupConditionalDisplay = (toggleId, containerId) => {
        const toggle = document.getElementById(toggleId);
        const container = document.getElementById(containerId);
        if (toggle && container) {
            const action = () => { container.style.display = toggle.checked ? 'block' : 'none'; };
            // On lie l'action au 'change' du toggle
            toggle.addEventListener('change', action);
            // On l'exécute une fois au chargement
            action(); 
        } else {
             console.warn(`Éléments manquants pour affichage conditionnel: ${toggleId} ou ${containerId}`);
        }
    };

    setupConditionalDisplay('toggle-ep', 'ep-options-container');
    setupConditionalDisplay('toggle-elt', 'elt-options-container');
    setupConditionalDisplay('toggle-dela', 'dela-options-container');
    setupConditionalDisplay('toggle-nonfiscal', 'nonfiscal-options-container');
    // --- Fin logique affichage ---

    // Boutons
    document.getElementById('f5-generate-button').addEventListener('click', genererEmail);
    document.getElementById('f5-copy-button').addEventListener('click', copierEmailHTML);
    
    genererEmail(); // Génération initiale
}