// features/f2_nonfiscal/f2.js - VERSION MISE À JOUR

import { formatMonetaire, updateElement, updateInputElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';

// NOUVEAU: Importer le store
import { getState, bindInput, updateState } from '../../core/store.js';

let nfEvolutionChartInstance; 
let nfRepartitionChartInstance; 

export function calculerProjectionF2() { 
    console.log("calculerProjectionF2 déclenché");
    try {
        // NOUVEAU: Lire les valeurs depuis le store
        const state = getState();
        const montantInitial = parseFloat(state.f2_initial) || 0;
        const versementMensuel = parseFloat(state.f2_versement) || 0;
        const rendementAnnuelPct = parseFloat(state.f2_rendement) || 0;
        const dureeAnnees = parseInt(state.f2_duree) || 0;

        // Logique de calcul (inchangée)
        if (dureeAnnees <= 0) {
             console.warn("F2: Durée nulle.");
             updateElement('nf-total-verse', 0); updateElement('nf-total-interets', 0); updateElement('nf-capital-final', 0); createNfEvolutionChart([]); createNfRepartitionChart(0, 0); return;
        }

        const rendementMensuel = Math.pow(1 + (rendementAnnuelPct / 100), 1 / 12) - 1;
        const dureeMois = dureeAnnees * 12;
        let capital = montantInitial;
        let evolutionData = [{ year: 0, capital: capital }]; 
        
        let totalVerseBrut = montantInitial; // Pour le graphique
        let evolutionVerse = [{ year: 0, verse: totalVerseBrut }]; // Pour le graphique

        for (let m = 1; m <= dureeMois; m++) {
            capital += versementMensuel;
            capital *= (1 + rendementMensuel);
            
            totalVerseBrut += versementMensuel; // Ajout pour le graphique

            if (m % 12 === 0) {
                evolutionData.push({ year: m / 12, capital: capital });
                evolutionVerse.push({ year: m / 12, verse: totalVerseBrut }); // Ajout
            }
        }
        if (dureeMois % 12 !== 0) {
            evolutionData.push({ year: dureeMois / 12, capital: capital });
            evolutionVerse.push({ year: dureeMois / 12, verse: totalVerseBrut }); // Ajout
        }
        
        const capitalFinal = capital;
        const totalVerse = montantInitial + (versementMensuel * dureeMois);
        const totalInterets = capitalFinal - totalVerse;

        // Mise à jour UI (inchangée)
        updateElement('nf-total-verse', totalVerse);
        updateElement('nf-total-interets', totalInterets);
        updateElement('nf-capital-final', capitalFinal);
        
        // MODIFIÉ: Envoyer les deux séries de données au graphique
        createNfEvolutionChart(evolutionData, evolutionVerse);
        createNfRepartitionChart(totalVerse, totalInterets);

    } catch (error) { console.error("Erreur majeure dans calculerProjectionF2:", error); }
}

// MODIFIÉ: Accepte dataVerse en plus
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
    const verseValues = dataVerse.map(d => d.verse); // Ajout

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


function createNfRepartitionChart(totalVerse, totalInterets) { 
    const ctx = document.getElementById('nfRepartitionChart')?.getContext('2d');
    if (!ctx) { console.warn("Canvas F_NonFiscal Répartition non trouvé"); return; }
    const t = translations[currentLang] || translations.fr;
    if (nfRepartitionChartInstance) { nfRepartitionChartInstance.destroy(); }

    const dataValues = [Math.max(0, totalVerse), Math.max(0, totalInterets)]; 
    const hasData = dataValues.some(v => v > 0);
    const data = hasData ? dataValues : [1];
    const labels = hasData ? [t.chart_invested, t.chart_interest] : [t.no_data];
    // MODIFIÉ: Inverser les couleurs pour correspondre au graphique linéaire
    const colors = hasData ? ['var(--secondary-color)', 'var(--primary-color)'] : ['#EBEBEB']; 

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

    // NOUVEAU: Lier les inputs au store
    bindInput('nf-montant-initial', 'f2_initial', calculerProjectionF2);
    bindInput('nf-versement-mensuel', 'f2_versement', () => {
        calculerProjectionF2();
        syncF2ToMail();
    });
    bindInput('nf-rendement', 'f2_rendement', calculerProjectionF2);
    bindInput('nf-duree', 'f2_duree', calculerProjectionF2);
    
    // Bouton: lance juste le calcul
    document.getElementById('f2-calculate-button').addEventListener('click', calculerProjectionF2);

    // Enregistrer pour les changements de langue
    registerOnLangChange(calculerProjectionF2);
    
    // NOUVEAU: Synchro vers le mail
    const syncF2ToMail = () => {
        // Ne pas synchroniser en mode visiteur
        if (document.body.classList.contains('mode-visitor')) return;
        
        const state = getState();
        const montant = state.f2_versement;
        updateInputElement('mail-nonfiscal-mensualite', montant);
        updateState('f5_nonfiscal_mensualite', montant);
    };

    // Premier calcul
    calculerProjectionF2();
    
    // Synchro initiale
    syncF2ToMail();
}