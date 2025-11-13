// features/f2_nonfiscal/f2.js

import { formatMonetaire, updateElement, updateInputElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';

// Importer le store
import { getState, bindInput, updateState } from '../../core/store.js';

let nfEvolutionChartInstance; 
let nfRepartitionChartInstance; 

export function calculerProjectionF2() { 
    console.log("calculerProjectionF2 déclenché avec nouveaux frais/taxes");
    try {
        // LIRE LES VALEURS DEPUIS LE STORE
        const state = getState();
        const montantInitial = parseFloat(state.f2_initial) || 0;
        const versementMensuel = parseFloat(state.f2_versement) || 0;
        const rendementAnnuelPct = parseFloat(state.f2_rendement) || 0;
        const dureeAnnees = parseInt(state.f2_duree) || 0;
        const fraisMensuelPctInput = parseFloat(state.f2_frais_versement) || 0; // LIRE LE NOUVEAU FRAIS
        
        // --- NOUVELLE LOGIQUE DE CALCUL ---
        const fraisMensuelPct = fraisMensuelPctInput / 100; // Convertir en décimal
        const fraisGestionAnnuelPct = (parseFloat(state.f2_frais_gestion) || 0) / 100; // <-- FRAIS DE GESTION
        const taxeVersamentPct = 0.02; // 2%
        const taxePlusValuePct = 0.10; // 10%
        const franchisePlusValue = 10000; // 10K €

        if (dureeAnnees <= 0) {
             console.warn("F2: Durée nulle.");
             // Reset des nouveaux champs du récap
             updateElement('nf-recap-initial', 0); 
             updateElement('nf-recap-contributions', 0); 
             updateElement('nf-total-interets', 0); 
             updateElement('nf-taxe-plus-value', 0); // NOUVEAU
             updateElement('nf-capital-final', 0);
             createNfEvolutionChart([], []); 
             createNfRepartitionChart(0, 0, 0); // 3 params
             return;
        }

        const rendementMensuel = Math.pow(1 + (rendementAnnuelPct / 100), 1 / 12) - 1;
        const dureeMois = dureeAnnees * 12;
        let capital = montantInitial;
        let evolutionData = [{ year: 0, capital: capital }]; 
        
        let totalVerseBrut = montantInitial; // Effort total de l'utilisateur (brut)
        let evolutionVerse = [{ year: 0, verse: totalVerseBrut }]; 

        // Calcul du versement net après frais et taxes (UTILISE fraisMensuelPct)
        const versementNet = versementMensuel * (1 - fraisMensuelPct - taxeVersamentPct);
        
        // Calcul du total net placé
        const totalNetPlace = montantInitial + (versementNet * dureeMois);
        // Calcul du total des versements mensuels (bruts)
        const totalVerseMensuel = versementMensuel * dureeMois;

        for (let m = 1; m <= dureeMois; m++) {
            capital += versementNet; // On ajoute le versement NET
            capital *= (1 + rendementMensuel);
            
            totalVerseBrut += versementMensuel; // On suit l'effort BRUT

            // --- NOUVELLE LOGIQUE (FRAIS DE GESTION ANNUELS) ---
            if (m > 0 && m % 12 === 0) {
                const fraisGestionAn = capital * fraisGestionAnnuelPct;
                capital -= (fraisGestionAn || 0);
            }
            // --- FIN NOUVELLE LOGIQUE ---

            if (m % 12 === 0) {
                evolutionData.push({ year: m / 12, capital: capital });
                evolutionVerse.push({ year: m / 12, verse: totalVerseBrut }); 
            }
        }
        if (dureeMois % 12 !== 0) {
            // Appliquer les frais de gestion au prorata pour la dernière période si elle n'est pas complète
            const moisRestants = dureeMois % 12;
            if (moisRestants > 0 && fraisGestionAnnuelPct > 0) {
                 const fraisGestionProrata = capital * (fraisGestionAnnuelPct * (moisRestants / 12));
                 capital -= (fraisGestionProrata || 0);
            }
            
            evolutionData.push({ year: dureeMois / 12, capital: capital });
            evolutionVerse.push({ year: dureeMois / 12, verse: totalVerseBrut });
        }
        
        const capitalFinalBrut = capital;
        // Total versé = Montant initial + (Versements mensuels BRUTS * durée)
        const totalVerse = montantInitial + totalVerseMensuel;
        
        // Calcul de la taxe finale
        const plusValueBrute = capitalFinalBrut - totalVerse;
        const plusValueTaxable = Math.max(0, plusValueBrute - franchisePlusValue);
        const taxeSurPlusValue = plusValueTaxable * taxePlusValuePct;
        
        // Capital final net après taxe
        const capitalFinalNet = capitalFinalBrut - taxeSurPlusValue;
        
        // Intérêts nets (après toutes taxes)
        const totalInteretsNets = capitalFinalNet - totalVerse;

        // Mise à jour UI (MODIFIÉE pour le nouveau récap)
        updateElement('nf-recap-initial', montantInitial);
        updateElement('nf-recap-contributions', totalVerseMensuel);
        updateElement('nf-total-interets', totalInteretsNets); // Intérêts nets
        updateElement('nf-taxe-plus-value', taxeSurPlusValue); // NOUVEAU: Taxe
        updateElement('nf-capital-final', capitalFinalNet); // Capital final net
        
        // Mettre à jour le dernier point du graphique avec le capital NET
        if (evolutionData.length > 0) {
            evolutionData[evolutionData.length - 1].capital = capitalFinalNet;
        }

        createNfEvolutionChart(evolutionData, evolutionVerse);
        // Passe les 3 parts au graphique
        createNfRepartitionChart(montantInitial, totalVerseMensuel, totalInteretsNets); 

    } catch (error) { console.error("Erreur majeure dans calculerProjectionF2:", error); }
}

// Accepte dataVerse en plus
function createNfEvolutionChart(dataCapital, dataVerse) { 
    const ctx = document.getElementById('nfEvolutionChart')?.getContext('2d');
    if (!ctx) { console.warn("Canvas F_NonFiscal Évolution non trouvé"); return; }
    const t = translations[currentLang] || translations.fr;
    if (nfEvolutionChartInstance) { nfEvolutionChartInstance.destroy(); }
    
    if (!dataCapital || dataCapital.length <= 1) { 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.font = "16px Inter"; ctx.fillStyle = "#ccc"; ctx.textAlign = "center";
        ctx.fillText(t.no_data || "Aucune donnée", ctx.canvas.width / 2, ctx.canvas.height / 2); 
        return;
    }
    
    const labels = dataCapital.map(d => d.year);
    const capitalValues = dataCapital.map(d => d.capital);
    const verseValues = dataVerse.map(d => d.verse);
    try {
        nfEvolutionChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { 
                        label: t.h4_evolution_f2, // 'Évolution du capital'
                        data: capitalValues, 
                        borderColor: 'var(--primary-color)', 
                        backgroundColor: 'rgba(0, 112, 176, 0.1)', 
                        borderWidth: 3, 
                        fill: true, 
                        tension: 0.1 
                    },
                    {
                        label: t.chart_invested, // 'Total Versé'
                        data: verseValues,
                        borderColor: 'var(--secondary-color)',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5] // Ligne en pointillés
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: t.chart_y_label }, ticks: { callback: value => formatMonetaire(value).replace(/\s?EUR/, '') } },
                    x: { title: { display: true, text: t.chart_x_label_f2 }, type: 'linear', ticks:{stepSize: 1} } 
                },
                plugins: { 
                    legend: { display: true, position: 'bottom' }, // Afficher la légende
                    tooltip: { 
                        callbacks: { 
                            label: ctx => `${ctx.dataset.label}: ${formatMonetaire(ctx.parsed.y)}`
                        } 
                    } 
                }
            }
        });
    } catch (e) { console.error("Erreur création graphique F_NonFiscal Évolution:", e); }
}


// Accepte 3 parts (initial, versements, interets)
function createNfRepartitionChart(montantInitial, totalVerseMensuel, totalInterets) { 
    const ctx = document.getElementById('nfRepartitionChart')?.getContext('2d');
    if (!ctx) { console.warn("Canvas F_NonFiscal Répartition non trouvé"); return; }
    const t = translations[currentLang] || translations.fr;
    if (nfRepartitionChartInstance) { nfRepartitionChartInstance.destroy(); }

    const dataValues = [Math.max(0, montantInitial), Math.max(0, totalVerseMensuel), Math.max(0, totalInterets)]; 
    const hasData = dataValues.some(v => v > 0);
    const data = hasData ? dataValues : [1];
    // Utilise 3 labels, dont la nouvelle clé 'chart_initial'
    const labels = hasData ? [t.chart_initial, t.chart_invested, t.chart_interest] : [t.no_data];
    
    // 3 couleurs
    const colors = hasData ? ['#36A2EB', '#4BC0C0', '#9966FF'] : ['#EBEBEB']; 

    try {
        nfRepartitionChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: labels, datasets: [{ label: t.h4_repartition, data: data, backgroundColor: colors, borderColor: '#FFFFFF', borderWidth: 2 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (!hasData) return t.no_data;
                                let label = context.label || '';
                                let value = context.parsed || 0;
                                let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let percentage = sum > 0 ? (value / sum * 100).toFixed(1) + '%' : '0.0%';
                                return `${label}: ${formatMonetaire(value)} (${percentage})`;
                            }
                        }
                    }
                }
            }
        });
    } catch (e) { console.error("Erreur création graphique F_NonFiscal Répartition:", e); }
}

/**
 * Initialise la fonctionnalité F2 (listeners)
 */
export function initF2() {
    console.log("Initialisation F2...");

    // LIER LES INPUTS AU STORE
    bindInput('nf-montant-initial', 'f2_initial', calculerProjectionF2);
    bindInput('nf-versement-mensuel', 'f2_versement', () => {
        calculerProjectionF2();
        syncF2ToMail();
    });
    bindInput('nf-rendement', 'f2_rendement', calculerProjectionF2);
    bindInput('nf-duree', 'f2_duree', calculerProjectionF2);
    bindInput('nf-frais-versement', 'f2_frais_versement', calculerProjectionF2);
    bindInput('nf-frais-gestion', 'f2_frais_gestion', calculerProjectionF2); 
    
    // Bouton: lance juste le calcul
    document.getElementById('f2-calculate-button').addEventListener('click', calculerProjectionF2);

    // Enregistrer pour les changements de langue
    registerOnLangChange(calculerProjectionF2);
    
    // Synchro vers le mail 
    const syncF2ToMail = () => {
        // Ne pas synchroniser en mode visiteur
        if (document.body.classList.contains('mode-visitor')) return;
        
        const state = getState();
        const montant = state.f2_versement;
        
        // --- Récupérer aussi l'année de naissance de F1 ---
        const birthYear = state.f1_birth_year; // Lire l'état de F1
        
        updateInputElement('mail-nonfiscal-mensualite', montant);
        updateState('f5_nonfiscal_mensualite', montant);
        
        // --- Mettre à jour l'année de naissance dans l'onglet mail ---
        updateInputElement('mail-nonfiscal-birthyear', birthYear);
        updateState('f5_nonfiscal_birthyear', birthYear);
    };

    // Premier calcul
    calculerProjectionF2();
    
    // Synchro initiale
    syncF2ToMail();
}