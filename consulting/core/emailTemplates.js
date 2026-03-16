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
            ${t('email_ep_amounts')}: ${t('email_ep_amounts_detail').replace('{amount}', formatMonetaire(data.versementBrutMensuel))}<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)}${t('email_per_month')}</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}${t('email_per_year')}</strong>.<br>
            ${t('email_ep_duration')} - ${t('email_ep_duration_detail').replace('{duration}', data.dureeVersementAnnees.toFixed(0))}<br>
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
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">${t('email_ep_option_title').replace('{index}', index + 1).replace('{amount}', formatMonetaire(data.versementBrutMensuel))}</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)}${t('email_per_month')}</strong></li>
                        <li>${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}${t('email_per_year')}</strong></li>
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
            ${t('email_ep_duration')} - ${t('email_ep_duration_short')}<br>
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
            ${t('email_ep_amounts')}: ${t('email_ep_amounts_detail').replace('{amount}', formatMonetaire(data.versementBrutMensuel))}<br>
            ${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)}${t('email_per_month')}</strong>.<br>
            ${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}${t('email_per_year')}</strong>.<br>
            ${t('email_elt_duration')} - ${t('email_elt_duration_detail').replace('{duration}', data.dureeVersementAnnees.toFixed(0)).replace('{targetAge}', data.targetAge)}<br>
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
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">${t('email_ep_option_title').replace('{index}', index + 1).replace('{amount}', formatMonetaire(data.versementBrutMensuel))}</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>${t('email_elt_duration')} : ${t('email_elt_duration_short').replace('{targetAge}', data.targetAge)}</li>
                        <li>${t('email_ep_net_cost')}: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)}${t('email_per_month')}</strong></li>
                        <li>${t('email_ep_deductibility')}: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}${t('email_per_year')}</strong></li>
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
                <li>${t('email_fund_ep_lt')} <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_1')}</a></li>
                <li>${t('email_fund_ep_lt')} <a href="https://www.comgest.com/fr/lu/professionnel/fonds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">${t('email_common_reco_axa_link_2')}</a></li>
                
                <li>${t('email_fund_ep_lt')} <a href="https://www.lecho.be/les-marches/fonds/r-co-valor-f-eur.60203572.html" target="_blank" rel="noopener noreferrer">AXA - Pension Plan R Valor</a></li>
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
                <li>${t('email_fund_ep_lt')} BlackRock - <a href="https://www.blackrock.com/fr/intermediaries/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_1')}</a></li>
                <li>${t('email_fund_ep')} P&V Group - <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">${t('email_common_reco_pv_link_2')}</a></li>
            </ul>
            
            <a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer"><strong>Allianz Global Investor</strong></a>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_fund_ep')} Allianz - <a href="https://www.lecho.be/les-marches/fonds/nordea-1-global-climate-and-environment-fund-bp-eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea</a></li>
            </ul>
            </p>
    `},

    comparator: (t, data, formatMonetaire) => {
        let html = `<h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_comp_title') || 'COMPARATIF DE VOS CONTRATS'}</h3>`;
        html += `<p>${t('email_comp_intro')}</p>`;

        html += `<table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; width: 33%;"></th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">${data.name1} ${t('email_comp_existing')}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #e6f2ff; text-align: center; color: #0070B0;">${data.name2} ${t('email_comp_proposal')}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${t('email_comp_yield')}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.rendement1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.rendement2.toFixed(2)} %</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${t('email_comp_entry_fee')}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.fraisEntree1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.fraisEntree2.toFixed(2)} %</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${t('email_comp_mgmt_fee')}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${data.fraisCourant1.toFixed(2)} %</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #0070B0;">${data.fraisCourant2.toFixed(2)} %</td>
                </tr>
            </tbody>
        </table>`;

        if (data.isStopSwitch) {
            const totalCombined = data.result1.capitalFinalNet + data.result2.capitalFinalNet;
            html += `<p>${t('email_comp_stop_switch_text').replace('{name1}', data.name1).replace('{name2}', data.name2)}</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_comp_est_capital_c1').replace('{name1}', data.name1)} <strong>${formatMonetaire(data.result1.capitalFinalNet)}</strong></li>
                <li>${t('email_comp_est_capital_c2').replace('{name2}', data.name2)} <strong>${formatMonetaire(data.result2.capitalFinalNet)}</strong></li>
                <li style="margin-top: 10px; font-size: 1.1em;"><strong>${t('email_comp_total_combined')} <span style="color: #00B3A6;">${formatMonetaire(totalCombined)}</span></strong></li>
            </ul>`;
        } else {
            const diff = data.result2.capitalFinalNet - data.result1.capitalFinalNet;
            const diffColor = diff > 0 ? '#00B3A6' : '#D3425A';
            const diffText = diff > 0 ? t('email_comp_gain') : t('email_comp_diff');
            const favorText = diff > 0 ? data.name2 : data.name1;

            html += `<ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_comp_net_c1').replace('{name1}', data.name1).replace('{age}', data.finalAge1)} <strong>${formatMonetaire(data.result1.capitalFinalNet)}</strong></li>
                <li>${t('email_comp_net_c1').replace('{name1}', data.name2).replace('{age}', data.finalAge2)} <strong>${formatMonetaire(data.result2.capitalFinalNet)}</strong></li>
            </ul>
            <p style="font-size: 1.1em; text-align: center; padding: 10px; background-color: #f9f9f9; border-radius: 5px; border: 1px solid var(--border-light);">
                <strong>${t('email_comp_balance')}</strong> ${diffText} <strong style="color: ${diffColor};">${formatMonetaire(Math.abs(diff))}</strong> ${t('email_comp_in_favor').replace('{name}', favorText)}
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
                <li>${t('email_fund_plci')} <a href="...">${t('email_plci_reco_pv_link_1')}</a></li>
            </ul>
            <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_device_plci')} <a href="...">${t('email_plci_reco_allianz_link_1')}</a></li>
            </ul>
        </p>
    `,

    inami: (t) => `
        <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 35px; font-family: 'Inter', sans-serif;">${t('email_inami_title')}</h3>
        <p>${t('email_inami_p1')}</p>
        <p>${t('email_inami_p2')}</p>
        <p style="padding: 5px; margin-top: 10px;">${t('email_inami_p3')}</p>
        <p style="margin-top: 15px;">
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_fund_inami')} <a href="...">${t('email_inami_reco_pv_link_1')}</a></li>
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
            <strong><u>${t('email_common_reco_title')}</u></strong><br>
            <strong><a href="https://ag.be/particuliers/fr" target="_blank" rel="noopener noreferrer">AG Insurance</a></strong>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>${t('email_fund_eip')} <a href="...">${t('email_eip_reco_ag_link_1')}</a></li>
                <li>${t('email_fund_eip')} <a href="...">${t('email_eip_reco_ag_link_2')}</a></li>
                <li>${t('email_fund_eip')} <a href="...">${t('email_eip_reco_ag_link_3')}</a></li>
                <li>${t('email_fund_eip')} <a href="...">${t('email_eip_reco_ag_link_4')}</a></li>
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
            html += `<p>${t('email_nf_compare_intro')}</p>`;
            dataArray.forEach((data, index) => {
                html += `
                <div style="background-color: #f9f9f9; border-left: 4px solid #0070B0; padding: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; color: #0070B0; margin-bottom: 5px;">${t('email_nf_option_title').replace('{index}', index + 1).replace('{amount}', formatMonetaire(data.mensualite))}</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>${t('email_nf_summary_10').replace('{age}', data.age + 10).replace('{invested}', formatMonetaire(data.res10.investedCapital)).replace('{final}', formatMonetaire(data.res10.finalCapital))}</li>
                        <li>${t('email_nf_summary_20').replace('{age}', data.age + 20).replace('{invested}', formatMonetaire(data.res20.investedCapital)).replace('{final}', formatMonetaire(data.res20.finalCapital))}</li>
                        <li>${t('email_nf_summary_30').replace('{age}', data.age + 30).replace('{invested}', formatMonetaire(data.res30.investedCapital)).replace('{final}', formatMonetaire(data.res30.finalCapital))}</li>
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
