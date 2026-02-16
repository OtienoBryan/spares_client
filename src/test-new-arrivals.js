// Simple test to check if the new arrivals API is working from the frontend
const API_BASE_URL = 'http://localhost:3001/api';

async function testNewArrivalsAPI() {
  try {
    console.log('🧪 Testing New Arrivals API from frontend...');
    
    const response = await fetch(`${API_BASE_URL}/products/new-arrivals`);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    console.log('Number of products:', data.length);
    
    return data;
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('Make sure the backend is running on http://localhost:3001');
  }
}

// Run the test
testNewArrivalsAPI();
