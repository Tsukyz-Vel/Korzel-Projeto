// src/utils/diceUtils.js

export const parseAndRollDamage = (damageStr, isCrit, multiplierStr) => {
  let cleanStr = damageStr.toLowerCase().replace(/\s+/g, '');
  let total = 0; let logs = []; let mult = 1;
  
  if (isCrit) mult = parseInt(multiplierStr.replace(/[^0-9]/g, '')) || 2;
  
  let parts = cleanStr.match(/[+-]?[^+-]+/g) || [cleanStr];
  
  parts.forEach(part => {
    let sign = part.startsWith('-') ? -1 : 1;
    let term = part.replace(/[+-]/, '');
    if (term.includes('d')) {
      let [countStr, facesStr] = term.split('d');
      let count = (parseInt(countStr) || 1) * mult;
      let faces = parseInt(facesStr) || 20;
      let subTotal = 0; let rolls = [];
      for(let i=0; i<count; i++) { 
        let r = Math.floor(Math.random() * faces) + 1; 
        subTotal += r; 
        rolls.push(r); 
      }
      total += sign * subTotal; 
      logs.push(`${sign === -1 ? '-' : '+'}[${rolls.join(', ')}]`);
    } else {
      let val = parseInt(term) || 0; 
      total += sign * val; 
      logs.push(`${sign === -1 ? '-' : '+'}${val}`);
    }
  });
  
  return { total, log: logs.join(' ').replace(/^\+/, '') };
};