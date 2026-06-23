import { systemCategories } from './category.constants';
import Category from './category.models';

export const normalizeCategoryName = (name: string): string => {
  const trimmedName = name.trim();

  if (!trimmedName) return '';

  return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();
};

export const seedSystemCategories = async () => {
  const formattedCategories = systemCategories.map((category) => ({
    ...category,
    name: normalizeCategoryName(category.name),
    userId: null,
  }));

  try {
    await Category.insertMany(formattedCategories, {
      ordered: false,
    });

    console.log('Categories seeded');
  } catch (error) {
    console.log('Some categories already existed');
  }
};
