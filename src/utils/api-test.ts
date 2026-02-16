// Simple API connection test utility
export const testApiConnection = async () => {
  const testUrl = 'http://143.110.191.116:3008/api/categories';
  
  try {
    console.log('Testing direct connection to:', testUrl);
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API test successful:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.error('API test failed:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('API test error:', error);
    return { success: false, error: error.message };
  }
};

// Test both direct and proxy connections
export const testAllConnections = async () => {
  console.log('=== API Connection Tests ===');
  
  // Test 1: Direct connection
  console.log('\n1. Testing direct connection...');
  const directResult = await testApiConnection();
  
  // Test 2: Proxy connection (if on Vercel)
  console.log('\n2. Testing proxy connection...');
  try {
    const proxyResponse = await fetch('/api/categories');
    console.log('Proxy response status:', proxyResponse.status);
    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      console.log('Proxy test successful:', data);
    } else {
      console.error('Proxy test failed:', proxyResponse.status);
    }
  } catch (error) {
    console.error('Proxy test error:', error);
  }
  
  return directResult;
};
