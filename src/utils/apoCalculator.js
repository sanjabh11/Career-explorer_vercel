// apoCalculator.js
import taxonomyData from '../../public/data/taxonomy.json';

const calculateItemAPO = (item, category) => {
  const itemName = item.name || item.title || '';
  const itemDescription = item.description || '';
  const fullText = `${itemName} ${itemDescription}`.toLowerCase();

  for (const [key, value] of Object.entries(taxonomyData[category] || {})) {
    if (fullText.includes(key.toLowerCase())) {
      return value;
    }
  }

  return Object.values(taxonomyData[category] || {}).reduce((a, b) => a + b, 0) / Object.values(taxonomyData[category] || {}).length || 0;
};

const calculateCategoryAPO = (items, category) => {
  if (!items || items.length === 0) return 0;
  const totalAPO = items.reduce((sum, item) => sum + calculateItemAPO(item, category), 0);
  return totalAPO / items.length;
};

export const calculateOverallAPO = (occupationData) => {
  const categories = [
    { name: 'tasks', items: occupationData.tasks },
    { name: 'knowledge', items: occupationData.knowledge },
    { name: 'skills', items: occupationData.skills },
    { name: 'abilities', items: occupationData.abilities },
    { name: 'technology', items: occupationData.technology }
  ];

  const categoryAPOs = categories.map(category => ({
    name: category.name,
    apo: calculateCategoryAPO(category.items, category.name)
  }));

  const overallAPO = categoryAPOs.reduce((sum, category) => sum + category.apo, 0) / categories.length;

  return {
    overall: overallAPO,
    categories: categoryAPOs
  };
};