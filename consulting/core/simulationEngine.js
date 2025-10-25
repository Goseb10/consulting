// core/simulationEngine.js
import { CURRENT_YEAR, AGE_TAXE, AGE_FINALE_DEFAUT } from './constants.js'; // Ajout de AGE_FINALE_DEFAUT

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

    const anneeFinale = anneeNaissance + targetAge; 
    const dureeAnnees = Math.max(0, anneeFinale - startYear); 
    const dureeMois = Math.floor(dureeAnnees * 12); 
    
    const annee60Ans = anneeNaissance + AGE_TAXE;
    const moisTaxe = Math.max(0, Math.floor((annee60Ans - startYear) * 12)); 

    // MODIFICATION: Permettre le calcul même si le versement est 0 (pour afficher 0 partout)
    if (dureeMois <= 0 || anneeNaissance < 1900 || anneeNaissance > (CURRENT_YEAR + 10)) {
         // Si la durée est nulle ou l'année de naissance invalide, on retourne 0
         return { capitalFinalNet: 0, capitalAuMomentTaxe: 0, taxeLiberatoire: 0, avantageFiscalTotal: 0, capitalNetPlaceTotal: 0, dureeAnnees: 0, avantageFiscalAnnuel: 0, versementBrutAnnuel: 0, evolutionCapital: [], dureeVersementAnnees: 0, capitalBrutPlaceTotal: 0, capitalNetPlaceMensuel: 0, avantageFiscalMensuel: 0, capitalNetPlaceAnnuel: 0, versementBrutMensuel: 0 };
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
    
    // Correction: l'âge d'arrêt doit être 67 (AGE_FINALE_DEFAUT) pour EP, ou targetAge pour ELT.
    // Pour EP (email), on s'arrête toujours à 67 ans pour les versements
    const stopAge = (typeEpargne === 'pension') ? AGE_FINALE_DEFAUT : targetAge;
    const anneeStop = anneeNaissance + stopAge;
    // La durée de versement va jusqu'à l'âge d'arrêt (67 pour EP, 67 ou 80 pour ELT)
    const dureeVersementAnnees = Math.max(0, Math.min(dureeAnnees, (anneeStop - startYear)));
    const avantageFiscalTotal = avantageFiscalAnnuel * dureeVersementAnnees; 
    const avantageFiscalMensuel = avantageFiscalAnnuel > 0 ? avantageFiscalAnnuel / 12 : 0;
    const moisVersement = Math.max(0, Math.floor(dureeVersementAnnees * 12));
    const capitalBrutPlaceTotal = versementBrutMensuel * moisVersement;
    const capitalNetPlaceTotal = capitalBrutPlaceTotal - avantageFiscalTotal;
    const capitalNetPlaceAnnuel = versementBrutAnnuel - avantageFiscalAnnuel;
    
    let capital = 0; 
    let capitalAuMomentTaxe = 0;
    let taxeLiberatoire = 0;
    let evolutionCapital = []; 
    let taxeAppliquee = false; 
    
    // La simulation (calcul du capital) doit tourner jusqu'à l'âge final (targetAge)
    for (let m = 1; m <= dureeMois; m++) {
        const ageActuel = (startYear - anneeNaissance) + (m / 12);
        let versementEffectif = 0;
        
        // On ne verse QUE si on est avant l'âge d'arrêt des versements (stopAge)
        if (ageActuel <= stopAge) {
             // On soustrait les frais d'entrée ET la taxe sur versement
             versementEffectif = versementBrutMensuel * (1 - fraisEntreePct - taxeVersementPct);
        }
        
        capital = (capital || 0) + (versementEffectif || 0); 
        capital *= (1 + rendementMensuel); 
        
        if (m > 0 && m % 12 === 0) { 
            const fraisGestionAn = capital * fraisCourantAnnuelPct;
            capital -= (fraisGestionAn || 0); 
        }
        
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
    
    if (moisTaxe <= 0 && !taxeAppliquee && dureeMois > 0) {
        capitalAuMomentTaxe = capital; 
        taxeLiberatoire = capital * tauxLib; 
        capital -= (taxeLiberatoire || 0); 
        taxeAppliquee = true; 
    }

    // Si la taxe n'a pas été appliquée (par ex. durée < 60 ans) mais qu'on a du capital
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
        dureeAnnees, evolutionCapital, dureeVersementAnnees
    };
}
