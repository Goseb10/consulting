// core/emailTemplates.js

/**
 * Note : Ce fichier est "pur" et ne contient pas de logique métier.
 * Il n'importe pas de constantes (comme CURRENT_YEAR).
 * Toute la logique de calcul doit être effectuée dans f5.js et les résultats
 * doivent être passés aux fonctions de ce template.
 */

// --- MISE À JOUR : Ajout d'un style de base pour les paragraphes et les listes ---
const pStyle = 'style="margin-bottom: 16px;"';
const ulStyle = 'style="margin-top: 5px; margin-bottom: 16px; padding-left: 20px; margin-left: 20px;"';
const olStyle = 'style="margin-top: 5px; margin-bottom: 16px; padding-left: 20px; margin-left: 20px;"';


export const emailTemplates = {
    
    /**
     * @param {function} t - Fonction de traduction (ex: t('email_intro_hello'))
     * @param {string} prenom
     * @param {string} nom
     * @param {string} email
     * @param {string} subject
     */
    intro: (t, prenom, nom, email, subject) => `
        <p ${pStyle}><strong>${t('email_intro_to')}:</strong> ${email || ' '}</p>
        
        <p style="font-weight: bold; margin-bottom: 16px; margin-top: 10px;">${subject}</p>
        
        <p ${pStyle}>${t('email_intro_hello')} ${prenom} ${nom},</p>
        <p ${pStyle}>${t('email_intro_p1')}</p>
        <p ${pStyle}>${t('email_intro_p2')}</p>
        <p ${pStyle}>${t('email_intro_p3')}</p>
    `,
    
    /**
     * @param {function} t
     * @param {object} data - Résultat de la simulation
     * @param {function} formatMonetaire
     */
    ep: (t, data, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_ep_title')}</h3>
        <p ${pStyle}>
            ${t('email_ep_amounts')}: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/an</strong>.<br>
            ${t('email_ep_duration')} - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - 67 ans.<br>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul ${ulStyle}>
                <li><strong>1,90%</strong> (${t('email_ep_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_ep_link_2')});</li>
                <li><strong>1,25%</strong> (${t('email_ep_link_3')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.wikifin.be/fr/epargner-et-investir/produits-dinvestissement/produits-dassurances/assurance-de-la-branche-23/quest" target="_blank" rel="noopener noreferrer">${t('email_ep_yield_source')}</a>.<br>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px; margin-left: 20px;">
                <li style="padding: 5px;">${t('email_ep_summary')
                    .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                    .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                    .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                </li>
            </ul>
        </p>
    `,

    elt: (t, data, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_elt_title')}</h3>
        <p ${pStyle}>
            ${t('email_ep_amounts')}: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)} / an</strong>.<br>
            ${t('email_elt_duration')} - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - ${data.targetAge} ans.<br>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul ${ulStyle}>
                <li><strong>1,90%</strong> (${t('email_elt_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_2')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_3')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_4')});</li>
                <li><strong>1,00%</strong> (${t('email_elt_link_5')});</li>
                <li><strong>1,25%</strong> (${t('email_elt_link_6')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">${t('email_elt_yield_source')}</a>.<br>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px; margin-left: 20px;">
                <li style="padding: 5px;">${t('email_elt_summary')
                    .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                    .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                    .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                </li>
            </ul>
        </p>
    `,

    ep_elt_common: (t, msciRate, formatMonetaire) => {
        const formattedMsciRate = (typeof msciRate === 'number' ? msciRate : 8.53).toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-credit-renouvelable/" target="_blank" rel="noopener noreferrer">${t('email_common_calculator_link')}</a>
        </p>
        <p style="font-size: 0.9em; font-style: italic; margin-bottom: 16px;">
            ${t('email_common_disclaimer').replace('{msciRate}', formattedMsciRate)}
        </p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>${t('email_common_links_title')}</u></strong><br>
            <a href="https://fin.belgium.be/fr/particuliers/avantages-fiscaux" target="_blank" rel="noopener noreferrer">${t('email_common_link_1')}</a><br>
            <a href="https://www.lecho.be/monargent/analyse/pension/ce-que-devrait-deja-faire-un-jeune-inquiet-pour-sa-pension/10301606.html" target="_blank" rel="noopener noreferrer">${t('email_common_link_2')}</a><br>
            <a href="https://www.un.org/fr/global-issues/ageing" target="_blank" rel="noopener noreferrer">${t('email_common_link_3')}</a><br>
            <a href="https://www.lecho.be/economie-politique/belgique/general/30-de-pensionnes-en-belgique-en-2050-quelles-consequences/9778044.html" target="_blank" rel="noopener noreferrer">${t('email_common_link_4')}</a>
        </p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <a href="https://www.axa.be/fr/particuliers/pension" target="_blank" rel="noopener noreferrer"><strong>AXA</strong></a>
            <ul ${ulStyle}>
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_1')}</a></li>
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.comgest.com/fr/lu/professionnel/fonds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_2')}</a></li>
                
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.lecho.be/les-marches/fonds/r-co-valor-f-eur.60203572.html" target="_blank" rel="noopener noreferrer">AXA - Pension Plan R Valor</a></li>
                <li style="list-style-type: none; margin-top: 5px;">
                    <ul style="padding-left: 20px; margin-top: 5px; margin-bottom: 5px; margin-left: 20px;">
                        <li>${t('email_common_reco_axa_li_1')}</li>
                        <li>${t('email_common_reco_axa_li_2')}</li>
                        <li>${t('email_common_reco_axa_li_3')}</li>
                    </ul>
                </li>
            </ul>
            <a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer"><strong>P&V Assurances SC (Vivium)</strong></a>
            <ul ${ulStyle}>
                <li>Fonds d'Epargne Pension/ Long Terme: BlackRock - <a href="https://www.blackrock.com/fr/intermediaries/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_1')}</a></li>
                <li>Fonds d'Epargne Pension: P&V Group - <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_2')}</a></li>
            </ul>
            
            <a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer"><strong>Allianz Global Investor</strong></a>
            <ul ${ulStyle}>
                <li>Fonds d'Epargne Pension: Allianz - <a href="https://www.lecho.be/les-marches/fonds/nordea-1-global-climate-and-environment-fund-bp-eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea</a></li>
            </ul>
            </p>
    `},

    plci: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_plci_title')}</h3>
        <p ${pStyle}>${t('email_plci_p1')}</p>
        <p ${pStyle}>${t('email_plci_p2')}</p>
        <p style="padding: 5px; margin-top: 10px; margin-bottom: 16px;">${t('email_plci_p3')}</p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
            <ul ${ulStyle}>
                <li>Fonds Pension Libre Complémentaire pour Indépendant: <a href="...">${t('email_plci_reco_pv_link_1')}</a></li>
            </ul>
            <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
            <ul ${ulStyle}>
                <li>Dispositif pour la Pension Libre Complémentaire pour Indépendant: <a href="...">${t('email_plci_reco_allianz_link_1')}</a></li>
            </ul>
        </p>
    `,

    inami: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_inami_title')}</h3>
        <p ${pStyle}>${t('email_inami_p1')}</p>
        <p ${pStyle}>${t('email_inami_p2')}</p>
        <p style="padding: 5px; margin-top: 10px; margin-bottom: 16px;">${t('email_inami_p3')}</p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" ...>P&V Assurances SC (Vivium)</a></strong>
            <ul ${ulStyle}>
                <li>Fonds Plan INAMI: <a href="...">${t('email_inami_reco_pv_link_1')}</a></li>
            </ul>
        </p>
    `,

    eip: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_eip_title')}</h3>
        <p ${pStyle}>${t('email_eip_p1')}</p>
        <p ${pStyle}>${t('email_eip_p2')}</p>
        <ul ${ulStyle}>
            <li>${t('email_eip_li_1')}</li>
            <li>${t('email_eip_li_2')}</li>
        </ul>
        <p ${pStyle}>${t('email_eip_p3')}</p>
        <p ${pStyle}>${t('email_eip_p4')}</p>
        <p style="padding: 5px; margin-top: 10px; margin-bottom: 16px;">${t('email_eip_p5')}</p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
            <strong><a href="https://ag.be/particuliers/fr..." ...>AG Insurance</a></strong>
            <ul ${ulStyle}>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_1')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_2')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_3')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_4')}</a></li>
            </ul>
        </p>
    `,

    nonfiscal: (t, mensualite, age, res10, res20, res30, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_nonfiscal_title')}</h3>
        <p ${pStyle}>
            ${t('email_nonfiscal_p1_line_1').replace('{mensualite}', formatMonetaire(mensualite))}<br>
            ${t('email_nonfiscal_p1_line_2')}<br>
            ${t('email_nonfiscal_p1_line_4')}<br>
            ${t('email_nonfiscal_p1_line_5')}<br>
        </p>
        <p style="margin-top: 10px; margin-bottom: 16px;">${t('email_nonfiscal_p2').replace('{age}', (parseInt(age) || 0) + 10)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${t('email_nonfiscal_p2_summary')
                .replace('{investedCapital}', formatMonetaire(res10.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res10.finalCapital))}
            </li>
        </ul>
        <p style="margin-top: 10px; margin-bottom: 16px;">${t('email_nonfiscal_p3').replace('{age}', (parseInt(age) || 0) + 20)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${t('email_nonfiscal_p3_summary')
                .replace('{investedCapital}', formatMonetaire(res20.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res20.finalCapital))}
            </li>
        </ul>
        <p style="margin-top: 10px; margin-bottom: 16px;">${t('email_nonfiscal_p4').replace('{age}', (parseInt(age) || 0) + 30)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${t('email_nonfiscal_p4_summary')
                .replace('{investedCapital}', formatMonetaire(res30.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res30.finalCapital))}
            </li>
        </ul>
        <p style="margin-top: 25px; margin-bottom: 16px;">${t('email_nonfiscal_p5')}</p>
        <p style="font-size: 0.9em; font-style: italic; margin-top: 10px; margin-bottom: 16px;">
            ${t('email_nonfiscal_p6')}
        </p>
        <p style="margin-top: 15px; margin-bottom: 16px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" ...>P&V Assurances SC (Vivium)</a></strong><br>
            ${t('email_nonfiscal_reco_pv_text')}
            <ul ${ulStyle}>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_1')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_2')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_3')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_4')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_5')}</a></li>
            </ul>
            <strong><a href="https://www.allianzgi.com/" ...>Allianz Global Investor</a></strong><br>
            ${t('email_nonfiscal_reco_allianz_text')}
            <ul ${ulStyle}>
                <li><a href="...">${t('email_nonfiscal_reco_allianz_link_1')}</a></li>
            </ul>
        </p>
    `,

    enfant: (t, child, res18, res21, res25, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_enfant_title').replace('{name}', child.name)}</h3>
        
        <p style="margin-top: 10px; margin-bottom: 16px;">${(t('email_enfant_p1') || "Simulation jusqu'à {age} ans :").replace('{age}', 18)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${(t('email_enfant_summary_18') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res18.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res18.finalCapital))}
            </li>
        </ul>
        
        <p style="margin-top: 10px; margin-bottom: 16px;">${(t('email_enfant_p2') || "Simulation jusqu'à {age} ans :").replace('{age}', 21)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${(t('email_enfant_summary_21') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res21.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res21.finalCapital))}
            </li>
        </ul>
        
        <p style="margin-top: 10px; margin-bottom: 16px;">${(t('email_enfant_p3') || "Simulation jusqu'à {age} ans :").replace('{age}', 25)}</p>
        <ul ${ulStyle}>
            <li style="padding: 5px;">${(t('email_enfant_summary_25') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res25.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res25.finalCapital))}
            </li>
        </ul>
    `,

    dela: (t, capital, prime, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_dela_title')}</h3>
        <p ${pStyle}>${t('email_dela_p1')}</p>
        <p ${pStyle}>${t('email_dela_p2')}</p>
        <p style="margin-top: 10px; margin-bottom: 16px;">${t('email_dela_p3')}</p>
        <ul ${ulStyle}>
            <li>${t('email_dela_li_1')
                .replace('{capital}', formatMonetaire(capital))
                .replace('{prime}', formatMonetaire(prime))}
            </li>
        </ul>
        <p ${pStyle}>${t('email_dela_p4')}</p>
        <p ${pStyle}>${t('email_dela_p5')}</p>
    `,

    rdv: (t, date, time, isTbd) => {
        const titleKey = isTbd ? 'email_rdv_title_tbd' : 'email_rdv_title';
        const title = t(titleKey)
                        .replace('{date}', date)
                        .replace('{time}', time);
        
        return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${title}</h3>
            <p ${pStyle}>${t('email_rdv_p1')}</p>
            <p ${pStyle}>${t('email_rdv_p2')}</p>
        `;
    },

    docs_eip: (t) => `
        <p style="font-weight: bold; margin-top: 10px; margin-bottom: 16px;">${t('email_docs_eip_title')}</p>
        <ol ${olStyle}>
            <li>${t('email_docs_eip_ol_1')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px; margin-left: 20px;">
                    <li>${t('email_docs_eip_ol_1_li_1')}</li>
                    <li>${t('email_docs_eip_ol_1_li_2')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_2')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px; margin-left: 20px;">
                    <li>${t('email_docs_eip_ol_2_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_3')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px; margin-left: 20px;">
                    <li>${t('email_docs_eip_ol_3_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_4')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px; margin-left: 20px;">
                    <li>${t('email_docs_eip_ol_4_li_1')}</li>
                    <li>${t('email_docs_eip_ol_4_li_2')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_5')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px; margin-left: 20px;">
                    <li>${t('email_docs_eip_ol_5_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_6')}</li>
            <li>${t('email_docs_eip_ol_7')}</li>
        </ol>
        <p ${pStyle}>${t('email_docs_eip_p1')}</p>
    `,

    outro: (t) => `
        <p style="margin-top: 20px; margin-bottom: 16px;">${t('email_outro_p1')}</p>
        <p style="margin-top: 15px; margin-bottom: 16px;">${t('email_outro_p2')}</p>
    `
};