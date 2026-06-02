// core/simulationEngine.js

import { CURRENT_YEAR, AGE_TAXE, AGE_FINALE_DEFAUT, AGE_MAX_VERSEMENT_EP } from './constants.js'; // Import de la nouvelle constante

/**
 * Moteur de simulation principal (utilisé par F1 et F4)
 * @param {object} params - Paramètres de simulation
 * @param {number} startYear - Année de début
 * @returns {object} - Résultats de la simulation
 */
export function effectuerSimulation(params, startYear = CURRENT_YEAR) { 
    const anneeNaissance = parseInt(params.anneeNaissance) || 0;
    const versementBrutMensuel = parseFloat(params.versementBrutMensuel) || 0;
    const typeEpargne = params.typeEpargne;
    const rendementAnnuel = parseFloat(params.rendementAnnuel) / 100 || 0; 
    const fraisEntreePct = parseFloat(params.fraisEntreePct) / 100 || 0; 
    const fraisCourantAnnuelPct = parseFloat(params.fraisCourantAnnuelPct) / 100 || 0; 
    const targetAge = params.targetAge || AGE_FINALE_DEFAUT; 
    
    // --- AJOUT ---
    // Récupérer le capital initial depuis les paramètres, avec 0 comme valeur par défaut
    const capitalInitial = parseFloat(params.capitalInitial) || 0;
    // --- FIN AJOUT ---

    const anneeFinale = anneeNaissance + targetAge; 
    const dureeAnnees = Math.max(0, anneeFinale - startYear); 
    const dureeMois = Math.floor(dureeAnnees * 12); 
    
    // Règle 1: La taxe est à 60 ans (AGE_TAXE)
    const anneeTaxeStandard = anneeNaissance + AGE_TAXE;
    // Règle 2: Mais au minimum 10 ans après le début du contrat
    const annee10AnsContrat = startYear + 10;
    // L'année de taxation réelle est le maximum de ces deux dates
    const anneeTaxe = Math.max(anneeTaxeStandard, annee10AnsContrat);
    // Calcul du mois de taxation basé sur l'année de taxe réelle
    const moisTaxe = Math.max(0, Math.floor((anneeTaxe - startYear) * 12)); 
    // On calcule l'âge réel de taxation pour l'affichage
    const ageTaxe = Math.round(anneeTaxe - anneeNaissance);

    // MODIFICATION: Permettre le calcul même si le versement est 0 (pour afficher 0 partout)
    if (dureeMois <= 0 || anneeNaissance < 1900 || anneeNaissance > (CURRENT_YEAR + 10)) {
         // Si la durée est nulle ou l'année de naissance invalide, on retourne 0
         return { capitalFinalNet: 0, capitalAuMomentTaxe: 0, taxeLiberatoire: 0, avantageFiscalTotal: 0, capitalNetPlaceTotal: 0, dureeAnnees: 0, avantageFiscalAnnuel: 0, versementBrutAnnuel: 0, evolutionCapital: [], dureeVersementAnnees: 0, capitalBrutPlaceTotal: 0, capitalNetPlaceMensuel: 0, avantageFiscalMensuel: 0, capitalNetPlaceAnnuel: 0, versementBrutMensuel: 0, ageTaxe: AGE_TAXE };
    }

    const versementBrutAnnuel = versementBrutMensuel * 12;
    const tauxLib = (typeEpargne === 'pension') ? 0.08 : 0.10; 
    
    // Ajout de la taxe de 2% sur les versements pour l'ELT (0% pour l'EP)
    const taxeVersementPct = (typeEpargne === 'long-terme') ? 0.02 : 0;

    const rendementMensuel = rendementAnnuel === 0 ? 0 : (Math.pow(1 + rendementAnnuel, 1/12) - 1); 

    let avantageFiscalAnnuel = 0;
    if (typeEpargne === 'pension') {
        const plafond30pct = 1050; const plafond25pct = 1350;
        const montantVerse = versementBrutAnnuel;
        if (montantVerse >= 360) { 
            if (montantVerse <= plafond30pct) { avantageFiscalAnnuel = montantVerse * 0.30; } 
            else if (montantVerse <= plafond25pct) { avantageFiscalAnnuel = montantVerse * 0.25; } 
            else { avantageFiscalAnnuel = plafond25pct * 0.25; }
        }
    } else if (typeEpargne === 'long-terme') {
        const plafondELT = 205 * 12; // 2460
        const montantDed = Math.min(versementBrutAnnuel, plafondELT);
         if (versementBrutMensuel >= 30) { avantageFiscalAnnuel = montantDed * 0.30; }
    }
    
    // --- LOGIQUE D'ÂGE D'ARRÊT DES VERSEMENTS MISE À JOUR ---
    // Pour EP, on s'arrête de verser à 64 ans (AGE_MAX_VERSEMENT_EP)
    // Pour ELT, on s'arrête à l'âge final (targetAge)
    const stopAgeVersement = (typeEpargne === 'pension') ? AGE_MAX_VERSEMENT_EP : targetAge;
    const anneeStop = anneeNaissance + stopAgeVersement;
    
    // La durée de versement va jusqu'à l'âge d'arrêt (64 pour EP, 67/80 pour ELT)
    const dureeVersementAnnees = Math.max(0, Math.min(dureeAnnees, (anneeStop - startYear)));
    const avantageFiscalTotal = avantageFiscalAnnuel * dureeVersementAnnees; 
    const avantageFiscalMensuel = avantageFiscalAnnuel > 0 ? avantageFiscalAnnuel / 12 : 0;
    const moisVersement = Math.max(0, Math.floor(dureeVersementAnnees * 12));
    
    // --- MODIFICATION ---
    // Le capital brut total placé doit maintenant inclure le capital initial
    const capitalBrutPlaceTotal = capitalInitial + (versementBrutMensuel * moisVersement);
    // Le capital net est calculé de la même manière
    const capitalNetPlaceTotal = capitalBrutPlaceTotal - avantageFiscalTotal;
    // --- FIN MODIFICATION ---
    
    const capitalNetPlaceAnnuel = versementBrutAnnuel - avantageFiscalAnnuel;
    
    // --- MODIFICATION ---
    // Initialiser le capital avec le capitalInitial au lieu de 0
    let capital = capitalInitial; 
    // --- FIN MODIFICATION ---
    
    let capitalAuMomentTaxe = 0;
    let taxeLiberatoire = 0;
    let evolutionCapital = []; 
    let taxeAppliquee = false; 
    
    // La simulation (calcul du capital) doit tourner jusqu'à l'âge final (targetAge)
    for (let m = 1; m <= dureeMois; m++) {
        const ageActuel = (startYear - anneeNaissance) + (m / 12);
        let versementEffectif = 0;
        
        // --- VÉRIFICATION DE L'ÂGE DE VERSEMENT MISE À JOUR ---
        // On ne verse QUE si on est avant ou égal à l'âge d'arrêt des versements (stopAgeVersement)
        if (ageActuel <= stopAgeVersement) {
             // On soustrait les frais d'entrée ET la taxe sur versement
             versementEffectif = versementBrutMensuel * (1 - fraisEntreePct - taxeVersementPct);
        }
        
        capital = (capital || 0) + (versementEffectif || 0); 
        capital *= (1 + rendementMensuel); 
        
        if (m > 0 && m % 12 === 0) { 
            const fraisGestionAn = capital * fraisCourantAnnuelPct;
            capital -= (fraisGestionAn || 0); 
        }
        
        // La logique de taxation utilise maintenant 'moisTaxe' qui est déjà corrigé
        if (m === moisTaxe && moisTaxe > 0 && !taxeAppliquee) {
            capitalAuMomentTaxe = capital; 
            taxeLiberatoire = capital * tauxLib;
            capital -= (taxeLiberatoire || 0); 
            taxeAppliquee = true; 
        }
        
        if (m % 12 === 0 || m === dureeMois) { 
             if (isNaN(capital) || !isFinite(capital)) { capital = 0; } 
             evolutionCapital.push({
                year: m / 12, 
                age: (startYear - anneeNaissance) + (m / 12),
                capital: capital 
            });
        }
    }
    
    // Cas où la simulation est courte (ex: commence à 65 ans)
    // Si 'moisTaxe' est 0 (parce que anneeTaxe < startYear) et qu'on n'a pas appliqué la taxe
    if (moisTaxe <= 0 && !taxeAppliquee && dureeMois > 0) {
        capitalAuMomentTaxe = capital; 
        taxeLiberatoire = capital * tauxLib; 
        capital -= (taxeLiberatoire || 0); 
        taxeAppliquee = true; 
    }

    // Si la taxe n'a pas été appliquée (ex: la simulation se termine AVANT l'année de taxation)
    // On applique la taxe à la fin.
    if (!taxeAppliquee && capital > 0) {
        capitalAuMomentTaxe = capital;
        taxeLiberatoire = capital * tauxLib;
        capital -= taxeLiberatoire;
    }
    
    const capitalFinalNet = isNaN(capital) ? 0 : capital;
    
    return {
        capitalFinalNet, capitalAuMomentTaxe, taxeLiberatoire,
        avantageFiscalTotal, capitalNetPlaceTotal, capitalBrutPlaceTotal, 
        versementBrutAnnuel, avantageFiscalAnnuel, capitalNetPlaceAnnuel, 
        versementBrutMensuel, avantageFiscalMensuel, 
        capitalNetPlaceMensuel: (versementBrutMensuel - avantageFiscalMensuel), 
        dureeAnnees, evolutionCapital, dureeVersementAnnees,
        ageTaxe // On retourne l'âge de taxation
    };
}