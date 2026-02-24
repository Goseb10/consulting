// core/emailTemplates.js

export const emailTemplates = {
    
    intro: (t, prenom, nom, email, subject) => `
        <p><strong>${t('email_intro_to')}:</strong> ${email || ' '}</p>
        
        <p style="font-weight: bold; margin-bottom: 15px; margin-top: 10px;">${subject}</p>
        
        <p>${t('email_intro_hello')} ${prenom} ${nom},</p>
        <p>${t('email_intro_p1')}</p>
        <p>${t('email_intro_p2')}</p>
        <p>${t('email_intro_p3')}</p>
    `,
    
    ep: (t, dataArray, formatMonetaire) => {
        if (!Array.isArray(dataArray)) dataArray = [dataArray];
        let html = `<h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_ep_title')}</h3>`;
        
        if (dataArray.length === 1) {
            let data = dataArray[0];
            html += `
        <p>
            ${t('email_ep_amounts')}: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/an</strong>.<br>
            ${t('email_ep_duration')} - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - 67 ans.<br>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>1,90%</strong> (${t('email_ep_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_ep_link_2')});</li>
                <li><strong>1,25%</strong> (${t('email_ep_link_3')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.wikifin.be/fr/epargner-et-investir/produits-dinvestissement/produits-dassurances/assurance-de-la-branche-23/quest" target="_blank" rel="noopener noreferrer">${t('email_ep_yield_source')}</a>.<br>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">${t('email_ep_summary')
                    .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                    .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                    .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                </li>
            </ul>
        </p>
            `;
        } else {
            html += `<p>${t('email_ep_intro')}</p>`;
            dataArray.forEach((data, index) => {
                html += `
                <div style="background-color: #f9f9f9; border-left: 4px solid #0070B0; padding: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">Option ${index + 1} : ${formatMonetaire(data.versementBrutMensuel)} BRUTS / mois</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong></li>
                        <li>${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/an</strong></li>
                        <li style="margin-top:5px;">${t('email_ep_summary')
                            .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                            .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                            .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                        </li>
                    </ul>
                </div>`;
            });
            html += `
        <p>
            ${t('email_ep_duration')} - âge terme - 67 ans.<br>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>1,90%</strong> (${t('email_ep_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_ep_link_2')});</li>
                <li><strong>1,25%</strong> (${t('email_ep_link_3')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.wikifin.be/fr/epargner-et-investir/produits-dinvestissement/produits-dassurances/assurance-de-la-branche-23/quest" target="_blank" rel="noopener noreferrer">${t('email_ep_yield_source')}</a>.
        </p>
            `;
        }
        return html;
    },

    elt: (t, dataArray, formatMonetaire) => {
        if (!Array.isArray(dataArray)) dataArray = [dataArray];
        let html = `<h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_elt_title')}</h3>`;
        
        if (dataArray.length === 1) {
            let data = dataArray[0];
            html += `
        <p>
            ${t('email_ep_amounts')}: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)} / an</strong>.<br>
            ${t('email_elt_duration')} - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - ${data.targetAge} ans.<br>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>1,90%</strong> (${t('email_elt_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_2')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_3')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_4')});</li>
                <li><strong>1,00%</strong> (${t('email_elt_link_5')});</li>
                <li><strong>1,25%</strong> (${t('email_elt_link_6')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">${t('email_elt_yield_source')}</a>.<br>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">${t('email_elt_summary')
                    .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                    .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                    .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                </li>
            </ul>
        </p>
            `;
        } else {
            html += `<p>${t('email_ep_intro')}</p>`;
            dataArray.forEach((data, index) => {
                html += `
                <div style="background-color: #f9f9f9; border-left: 4px solid #0070B0; padding: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">Option ${index + 1} : ${formatMonetaire(data.versementBrutMensuel)} BRUTS / mois</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>${t('email_elt_duration')} : âge terme <strong>${data.targetAge} ans</strong></li>
                        <li>${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong></li>
                        <li>${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/an</strong></li>
                        <li style="margin-top:5px;">${t('email_elt_summary')
                            .replace('{capitalBrut}', formatMonetaire(data.capitalBrutPlaceTotal))
                            .replace('{capitalFinal}', formatMonetaire(data.capitalFinalNet))
                            .replace('{avantageFiscal}', formatMonetaire(data.avantageFiscalTotal))}
                        </li>
                    </ul>
                </div>`;
            });
            html += `
        <p>
            ${t('email_ep_entry_fees')}: <strong>3,00%</strong><br>
            ${t('email_ep_mgmt_fees')}:
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>1,90%</strong> (${t('email_elt_link_1')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_2')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_3')});</li>
                <li><strong>0,85%</strong> (${t('email_elt_link_4')});</li>
                <li><strong>1,00%</strong> (${t('email_elt_link_5')});</li>
                <li><strong>1,25%</strong> (${t('email_elt_link_6')}).</li>
            </ul>
            ${t('email_ep_yield_text')}: ${t('email_common_yield_range')} <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">${t('email_elt_yield_source')}</a>.
        </p>
            `;
        }
        return html;
    },

    ep_elt_common: (t, msciRate, formatMonetaire) => {
        const formattedMsciRate = (typeof msciRate === 'number' ? msciRate : 8.53).toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `
        <p style="margin-top: 15px;">
            <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-credit-renouvelable/" target="_blank" rel="noopener noreferrer">${t('email_common_calculator_link')}</a>
        </p>
        <p style="font-size: 0.9em; font-style: italic;">
            ${t('email_common_disclaimer').replace('{msciRate}', formattedMsciRate)}
        </p>
        <p style="margin-top: 15px;">
            <strong><u>${t('email_common_links_title')}</u></strong><br>
            <a href="https://fin.belgium.be/fr/particuliers/avantages-fiscaux" target="_blank" rel="noopener noreferrer">${t('email_common_link_1')}</a><br>
            <a href="https://www.lecho.be/monargent/analyse/pension/ce-que-devrait-deja-faire-un-jeune-inquiet-pour-sa-pension/10301606.html" target="_blank" rel="noopener noreferrer">${t('email_common_link_2')}</a><br>
            <a href="https://www.un.org/fr/global-issues/ageing" target="_blank" rel="noopener noreferrer">${t('email_common_link_3')}</a><br>
            <a href="https://www.lecho.be/economie-politique/belgique/general/30-de-pensionnes-en-belgique-en-2050-quelles-consequences/9778044.html" target="_blank" rel="noopener noreferrer">${t('email_common_link_4')}</a>
        </p>
        <p style="margin-top: 15px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <a href="https://www.axa.be/fr/particuliers/pension" target="_blank" rel="noopener noreferrer"><strong>AXA</strong></a>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_1')}</a></li>
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.comgest.com/fr/lu/professionnel/fonds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_2')}</a></li>
                
                <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.lecho.be/les-marches/fonds/r-co-valor-f-eur.60203572.html" target="_blank" rel="noopener noreferrer">AXA - Pension Plan R Valor</a></li>
                <li style="list-style-type: none; margin-top: 5px;">
                    <ul style="padding-left: 20px; margin-top: 5px; margin-bottom: 5px;">
                        <li>${t('email_common_reco_axa_li_1')}</li>
                        <li>${t('email_common_reco_axa_li_2')}</li>
                        <li>${t('email_common_reco_axa_li_3')}</li>
                    </ul>
                </li>
            </ul>
            <a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer"><strong>P&V Assurances SC (Vivium)</strong></a>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds d'Epargne Pension/ Long Terme: BlackRock - <a href="https://www.blackrock.com/fr/intermediaries/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_1')}</a></li>
                <li>Fonds d'Epargne Pension: P&V Group - <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_2')}</a></li>
            </ul>
            
            <a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer"><strong>Allianz Global Investor</strong></a>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds d'Epargne Pension: Allianz - <a href="https://www.lecho.be/les-marches/fonds/nordea-1-global-climate-and-environment-fund-bp-eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea</a></li>
            </ul>
            </p>
    `},

    // --- NOUVEAU: TEMPLATE COMPARATEUR ---
    comparator: (t, data, formatMonetaire) => {
        let html = `<h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_comp_title') || 'COMPARATIF DE VOS CONTRATS'}</h3>`;
        html += `<p>${t('email_comp_intro') || 'Suite à notre analyse, voici la comparaison entre votre situation actuelle et notre proposition :'}</p>`;

        html += `<table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; width: 33%;"></th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">${data.name1} (Existant)</th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #e6f2ff; text-align: center; color: #0070B0;">${data.name2} (Proposition)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Rendement estimé</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.rendement1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.rendement2.toFixed(2)} %</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Frais d'entrée</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.fraisEntree1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.fraisEntree2.toFixed(2)} %</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Frais de gestion annuels</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.fraisCourant1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.fraisCourant2.toFixed(2)} %</td>
                </tr>
            </tbody>
        </table>`;

        if (data.isStopSwitch) {
            const totalCombined = data.result1.capitalFinalNet + data.result2.capitalFinalNet;
            html += `<p>Dans le cadre d'un scénario <strong>"Stop & Switch"</strong>, nous vous conseillons d'arrêter les versements sur votre contrat ${data.name1} actuel et de le laisser fructifier, tout en démarrant un nouveau contrat chez ${data.name2}.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Capital estimé du contrat ${data.name1} à terme : <strong>${formatMonetaire(data.result1.capitalFinalNet)}</strong></li>
                <li>Capital estimé du nouveau contrat ${data.name2} à terme : <strong>${formatMonetaire(data.result2.capitalFinalNet)}</strong></li>
                <li style="margin-top: 10px; font-size: 1.1em;"><strong>Capital Final Total Combiné : <span style="color: #00B3A6;">${formatMonetaire(totalCombined)}</span></strong></li>
            </ul>`;
        } else {
            const diff = data.result2.capitalFinalNet - data.result1.capitalFinalNet;
            const diffColor = diff > 0 ? '#00B3A6' : '#D3425A';
            const diffText = diff > 0 ? `Un gain supplémentaire estimé à` : `Une différence de`;

            html += `<ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Capital final net estimé chez ${data.name1} (${data.finalAge1} ans) : <strong>${formatMonetaire(data.result1.capitalFinalNet)}</strong></li>
                <li>Capital final net estimé chez ${data.name2} (${data.finalAge2} ans) : <strong>${formatMonetaire(data.result2.capitalFinalNet)}</strong></li>
            </ul>
            <p style="font-size: 1.1em; text-align: center; padding: 10px; background-color: #f9f9f9; border-radius: 5px; border: 1px solid var(--border-light);">
                <strong>Bilan :</strong> ${diffText} <strong style="color: ${diffColor};">${formatMonetaire(Math.abs(diff))}</strong> en faveur de la proposition ${diff > 0 ? data.name2 : data.name1}.
            </p>`;
        }

        return html;
    },

    plci: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_plci_title')}</h3>
        <p>${t('email_plci_p1')}</p>
        <p>${t('email_plci_p2')}</p>
        <p style="padding: 5px; margin-top: 10px;">${t('email_plci_p3')}</p>
        <p style="margin-top: 15px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds Pension Libre Complémentaire pour Indépendant: <a href="...">${t('email_plci_reco_pv_link_1')}</a></li>
            </ul>
            <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Dispositif pour la Pension Libre Complémentaire pour Indépendant: <a href="...">${t('email_plci_reco_allianz_link_1')}</a></li>
            </ul>
        </p>
    `,

    inami: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_inami_title')}</h3>
        <p>${t('email_inami_p1')}</p>
        <p>${t('email_inami_p2')}</p>
        <p style="padding: 5px; margin-top: 10px;">${t('email_inami_p3')}</p>
        <p style="margin-top: 15px;">
            <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds Plan INAMI: <a href="...">${t('email_inami_reco_pv_link_1')}</a></li>
            </ul>
        </p>
    `,

    eip: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_eip_title')}</h3>
        <p>${t('email_eip_p1')}</p>
        <p>${t('email_eip_p2')}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li>${t('email_eip_li_1')}</li>
            <li>${t('email_eip_li_2')}</li>
        </ul>
        <p>${t('email_eip_p3')}</p>
        <p>${t('email_eip_p4')}</p>
        <p style="padding: 5px; margin-top: 10px;">${t('email_eip_p5')}</p>
        <p style="margin-top: 15px;">
            <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
            <strong><a href="https://ag.be/particuliers/fr" target="_blank" rel="noopener noreferrer">AG Insurance</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_1')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_2')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_3')}</a></li>
                <li>Fonds Engagement Individuel de Pension: <a href="...">${t('email_eip_reco_ag_link_4')}</a></li>
            </ul>
        </p>
    `,

    nonfiscal: (t, dataArray, formatMonetaire) => {
        if (!Array.isArray(dataArray)) dataArray = [dataArray];
        let html = `<h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_nonfiscal_title')}</h3>`;
        
        if (dataArray.length === 1) {
            let data = dataArray[0];
            html += `
        <p>
            ${t('email_nonfiscal_p1_line_1').replace('{mensualite}', formatMonetaire(data.mensualite))}<br>
            ${t('email_nonfiscal_p1_line_2')}<br>
            ${t('email_nonfiscal_p1_line_4')}<br>
            ${t('email_nonfiscal_p1_line_5')}<br>
        </p>
        <p style="margin-top: 10px;">${t('email_nonfiscal_p2').replace('{age}', data.age + 10)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${t('email_nonfiscal_p2_summary')
                .replace('{investedCapital}', formatMonetaire(data.res10.investedCapital))
                .replace('{finalCapital}', formatMonetaire(data.res10.finalCapital))}
            </li>
        </ul>
        <p style="margin-top: 10px;">${t('email_nonfiscal_p3').replace('{age}', data.age + 20)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${t('email_nonfiscal_p3_summary')
                .replace('{investedCapital}', formatMonetaire(data.res20.investedCapital))
                .replace('{finalCapital}', formatMonetaire(data.res20.finalCapital))}
            </li>
        </ul>
        <p style="margin-top: 10px;">${t('email_nonfiscal_p4').replace('{age}', data.age + 30)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${t('email_nonfiscal_p4_summary')
                .replace('{investedCapital}', formatMonetaire(data.res30.investedCapital))
                .replace('{finalCapital}', formatMonetaire(data.res30.finalCapital))}
            </li>
        </ul>
            `;
        } else {
            html += `<p>Voici une comparaison selon vos différents choix de montants mensuels :</p>`;
            dataArray.forEach((data, index) => {
                html += `
                <div style="background-color: #f9f9f9; border-left: 4px solid #0070B0; padding: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">Option ${index + 1} : ${formatMonetaire(data.mensualite)} / mois</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>À 10 ans (${data.age + 10} ans)</strong> : Capital investi de ${formatMonetaire(data.res10.investedCapital)} pour un capital estimé à <strong>${formatMonetaire(data.res10.finalCapital)}</strong>.</li>
                        <li><strong>À 20 ans (${data.age + 20} ans)</strong> : Capital investi de ${formatMonetaire(data.res20.investedCapital)} pour un capital estimé à <strong>${formatMonetaire(data.res20.finalCapital)}</strong>.</li>
                        <li><strong>À 30 ans (${data.age + 30} ans)</strong> : Capital investi de ${formatMonetaire(data.res30.investedCapital)} pour un capital estimé à <strong>${formatMonetaire(data.res30.finalCapital)}</strong>.</li>
                    </ul>
                </div>`;
            });
            html += `<p>${t('email_nonfiscal_p1_line_2')}<br>${t('email_nonfiscal_p1_line_4')}<br>${t('email_nonfiscal_p1_line_5')}</p>`;
        }
        
        html += `
        <p style="margin-top: 25px;">${t('email_nonfiscal_p5')}</p>
        <p style="font-size: 0.9em; font-style: italic; margin-top: 10px;">
            ${t('email_nonfiscal_p6')}
        </p>
        <p style="margin-top: 15px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong><br>
            ${t('email_nonfiscal_reco_pv_text')}
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_1')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_2')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_3')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_4')}</a></li>
                <li><a href="...">${t('email_nonfiscal_reco_pv_link_5')}</a></li>
            </ul>
            <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong><br>
            ${t('email_nonfiscal_reco_allianz_text')}
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><a href="...">${t('email_nonfiscal_reco_allianz_link_1')}</a></li>
            </ul>
        </p>
        `;
        return html;
    },

    enfant: (t, child, res18, res21, res25, formatMonetaire) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_enfant_title').replace('{name}', child.name)}</h3>
        
        <p style="margin-top: 10px;">${(t('email_enfant_p1') || "Simulation jusqu'à {age} ans :").replace('{age}', 18)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${(t('email_enfant_summary_18') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res18.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res18.finalCapital))}
            </li>
        </ul>
        
        <p style="margin-top: 10px;">${(t('email_enfant_p2') || "Simulation jusqu'à {age} ans :").replace('{age}', 21)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${(t('email_enfant_summary_21') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res21.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res21.finalCapital))}
            </li>
        </ul>
        
        <p style="margin-top: 10px;">${(t('email_enfant_p3') || "Simulation jusqu'à {age} ans :").replace('{age}', 25)}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li style="padding: 5px;">${(t('email_enfant_summary_25') || "Capital investi de <strong>{investedCapital}</strong> pour un capital final de <strong>{finalCapital}</strong>.")
                .replace('{investedCapital}', formatMonetaire(res25.investedCapital))
                .replace('{finalCapital}', formatMonetaire(res25.finalCapital))}
            </li>
        </ul>
    `,

    dela: (t, dataArray, formatMonetaire) => {
        if (!Array.isArray(dataArray)) dataArray = [dataArray];
        let html = `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_dela_title')}</h3>
        <p>${t('email_dela_p1')}</p>
        <p>${t('email_dela_p2')}</p>
        <p style="margin-top: 10px;">${t('email_dela_p3')}</p>
        <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
        `;
        
        dataArray.forEach(data => {
            html += `<li>${t('email_dela_li_1')
                .replace('{capital}', formatMonetaire(data.capital))
                .replace('{prime}', formatMonetaire(data.prime))}
            </li>`;
        });
        
        html += `
        </ul>
        <p>${t('email_dela_p4')}</p>
        <p>${t('email_dela_p5')}</p>
        `;
        return html;
    },

    rdv: (t, date, time, isTbd) => {
        const titleKey = isTbd ? 'email_rdv_title_tbd' : 'email_rdv_title';
        const title = t(titleKey)
                        .replace('{date}', date)
                        .replace('{time}', time);
        
        return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${title}</h3>
            <p>${t('email_rdv_p1')}</p>
            <p>${t('email_rdv_p2')}</p>
        `;
    },

    docs_eip: (t) => `
        <p style="font-weight: bold; margin-top: 10px;">${t('email_docs_eip_title')}</p>
        <ol style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
            <li>${t('email_docs_eip_ol_1')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                    <li>${t('email_docs_eip_ol_1_li_1')}</li>
                    <li>${t('email_docs_eip_ol_1_li_2')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_2')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                    <li>${t('email_docs_eip_ol_2_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_3')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                    <li>${t('email_docs_eip_ol_3_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_4')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                    <li>${t('email_docs_eip_ol_4_li_1')}</li>
                    <li>${t('email_docs_eip_ol_4_li_2')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_5')}
                <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                    <li>${t('email_docs_eip_ol_5_li_1')}</li>
                </ul>
            </li>
            <li>${t('email_docs_eip_ol_6')}</li>
            <li>${t('email_docs_eip_ol_7')}</li>
        </ol>
        <p>${t('email_docs_eip_p1')}</p>
    `,

    outro: (t) => `
        <p style="margin-top: 20px;">${t('email_outro_p1')}</p>
        <p style="margin-top: 15px;">${t('email_outro_p2')}</p>
    `
};
