export const parseDistressMessage = (rawMessage, reportedDistrict, reportedState) => {
  const text = (rawMessage || '').toLowerCase();
  
  // 1. Extract Items Needed
  const items = [];
  if (text.includes('water') || text.includes('thirsty')) items.push('Potable Water');
  if (text.includes('food') || text.includes('hungry') || text.includes('ration')) items.push('Dry Food Kits');
  if (text.includes('baby') || text.includes('infant')) items.push('Baby Food');
  if (text.includes('medical') || text.includes('medicine') || text.includes('sick') || text.includes('fever')) items.push('Medical Supplies');
  if (text.includes('tarp') || text.includes('shelter') || text.includes('roof') || text.includes('tent')) items.push('Shelter Tarps');
  if (text.includes('clothes') || text.includes('blanket') || text.includes('cold')) items.push('Blankets/Clothes');
  
  if (items.length === 0) items.push('General Relief Supplies');

  // 2. Extract Urgency
  let urgency = 'medium';
  if (text.includes('stranded') || text.includes('trapped') || text.includes('dying') || text.includes('critical') || text.includes('emergency')) {
    urgency = 'critical';
  } else if (text.includes('urgent') || text.includes('fast') || text.includes('infant') || text.includes('medical')) {
    urgency = 'high';
  }

  // 3. Extract Estimated Headcount
  const numberMatches = text.match(/\d+/g);
  let estimated_headcount = 50; // Fallback
  if (numberMatches) {
    const nums = numberMatches.map(Number).filter(n => n > 0 && n <= 10000);
    if (nums.length > 0) {
      estimated_headcount = Math.max(...nums);
    }
  }

  // 4. Calculate Funds Needed (e.g., ₹250 per person for 3-day basic ration kit)
  const estimated_funds_needed = estimated_headcount * 250;

  // 5. Generate Summary Headline
  const locString = [reportedDistrict, reportedState].filter(Boolean).join(', ');
  const locText = locString ? ` in ${locString}` : '';
  const summary = `${urgency.charAt(0).toUpperCase() + urgency.slice(1)} relief needed for ~${estimated_headcount} individuals${locText}.`;

  return {
    items_needed: items,
    urgency,
    estimated_headcount,
    estimated_funds_needed,
    summary
  };
};
