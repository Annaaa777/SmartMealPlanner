const BASE_URL = 'http://127.0.0.1:5000/api';

// Helper function for POST requests
async function postRequest(endpoint, data = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Helper function for PUT requests
async function putRequest(endpoint, data = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Helper function for GET requests
async function getRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Helper function for DELETE requests
async function deleteRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// ✅ API Methods
export const generateMealPlan = (data) => postRequest('/mealplan', data);

export const getRecipes = () => getRequest('/get_recipes');

export const addRecipe = (recipe) => postRequest('/add_recipe', recipe);

export const updateRecipe = (id, recipe) => putRequest(`/update_recipe/${id}`, recipe);

export const deleteRecipe = (id) => deleteRequest(`/delete_recipe/${id}`);

export const fetchMoreRecipes = () => postRequest('/fetch_more_recipes');

export const suggestRecipes = (ingredients) => postRequest('/suggest', { ingredients });
