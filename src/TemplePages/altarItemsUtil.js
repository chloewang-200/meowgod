// Remove fake data import since we're using real API
// import fakeAltarData from './fakeAltarData.json';

// Function to get user items from API
export const getUserAltarItems = async (currentUser) => {
  try {
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://meow-god-backend-717901323721.us-central1.run.app'}/altar/items`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch altar items: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching altar items:', error);
    throw error;
  }
};

// Function to save a new altar item
export const saveAltarItem = async (currentUser, itemData) => {
  try {
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://meow-god-backend-717901323721.us-central1.run.app'}/altar/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save altar item: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving altar item:', error);
    throw error;
  }
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