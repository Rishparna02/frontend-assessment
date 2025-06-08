
import { faker } from '@faker-js/faker';

export interface Category {
  id: string;
  name: string;
  isSelected: boolean;
}

export const generateCategories = (): Category[] => {
  const categories: Category[] = [];
  const categoryNames = new Set<string>();
  
  // Generate unique category names
  while (categoryNames.size < 100) {
    const category = faker.commerce.department();
    categoryNames.add(category);
  }
  
  // Convert to category objects
  Array.from(categoryNames).forEach((name, index) => {
    categories.push({
      id: `cat-${index + 1}`,
      name,
      isSelected: false
    });
  });
  
  return categories;
};

export const getStoredCategories = (): Category[] => {
  const stored = localStorage.getItem("categories");
  if (stored) {
    return JSON.parse(stored);
  }
  const categories = generateCategories();
  localStorage.setItem("categories", JSON.stringify(categories));
  return categories;
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem("categories", JSON.stringify(categories));
};
