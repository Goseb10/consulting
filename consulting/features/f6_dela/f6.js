import { updateElement, formatMonetaire } from '../../core/utils.js';
import { calculerPrimeDela } from './delaEngine.js';

export function initDela() {
    const inputs = ['dela-capital', 'dela-age', 'dela-terme'];
    
    const rafraichirDela = () => {
        const cap = parseFloat(document.getElementById('dela-capital').value);
        const age = parseInt(document.getElementById('dela-age').value);
        const terme = parseInt(document.getElementById('dela-terme').value);
        
        const prime = calculerPrimeDela(age, cap, terme);
        const totalInvesti = prime * 12 * (terme - age);
        
        updateElement('dela-result-prime', prime);
        updateElement('dela-total-investi', totalInvesti);
        updateElement('dela-taxe', prime * 0.02);
    };

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', rafraichirDela);
    });
    
    rafraichirDela();
}