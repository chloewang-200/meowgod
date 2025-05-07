import fakeAltarData from './fakeAltarData.json';

// Mock function to get user items from fake data
export const getUserAltarItems = (userId) => {
  // In a real implementation, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = fakeAltarData.users.find(user => user.userId === userId);
      
      if (userData) {
        // Validate that all IDs are numbers
        const items = userData.items.map(item => {
          // Ensure ID is a number
          return {
            ...item,
            id: Number(item.id)
          };
        });
        resolve(items);
      } else {
        resolve([]);
      }
    }, 300); // Simulate network delay
  });
};

// Mock function to save a new altar item
export const saveAltarItem = (userId, itemData) => {
  // In a real implementation, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ensure ID is stored as a number
      const validatedItem = {
        ...itemData,
        id: Number(itemData.id)
      };
      
      console.log('Saving item for user', userId, validatedItem);
      // Just simulate success
      resolve({
        success: true,
        item: validatedItem
      });
    }, 300);
  });
};

// Helper to format item data for the UI
export const formatItemForDisplay = (item) => {
  return {
    ...item,
    id: Number(item.id), // Ensure ID is a number
    style: {
      left: item.position.left,
      top: item.position.top
    }
  };
}; 