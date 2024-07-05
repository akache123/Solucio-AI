# API Endpoints and Usage Guide

## Endpoints

### 1. `/api/swipe_right`

- **Purpose:** Initiates a swipe right action.
- **Method:** POST
- **Parameters:**
  - `clerkId`: ID of the Clerk user performing the action.
  - `objectId`: ID of the object being swiped.
- **Usage Example:**
  ```javascript
  const handleSwipeRight = async () => {
    const objectId = {objectId};
    try {
      const response = await axios.post('/api/swipe_right', {
        clerkId: user.id,
        objectId: objectId
      });
      console.log('Response from /api/swipe_right:', response.data);
    } catch (error) {
      console.error('Error on swipe right:', error);
    }
  };
  ```

  ### 1b. `/api/swipe_left`

- **Purpose:** Initiates a swipe left action.
- **Method:** POST
- **Parameters:**
  - \`clerkId\`: ID of the Clerk user performing the action.
  - \`objectId\`: ID of the object being swiped.
- **Usage Example:**
  ```javascript
  const handleSwipeLeft = async () => {
    const objectId = '6683a5ed53238178ac59b76f';
    try {
      const response = await axios.post('/api/swipe_left', {
        clerkId: user.id,
        objectId: objectId
      });
      console.log('Response from /api/swipe_left:', response.data);
    } catch (error) {
      console.error('Error on swipe left:', error);
    }
  };```

### 1c. `/api/liked`

- **Purpose:** Handles liked objects action.
- **Method:** POST
- **Parameters:**
  - \`clerkId\`: ID of the Clerk user performing the action.
  - \`objectId\`: ID of the object being liked.
- **Usage Example:**
```javascript
  const handleLiked = async () => {
    const objectId = '6683a5ed53238178ac59b76f';
    try {
      const response = await axios.post('/api/liked', {
        clerkId: user.id,
        objectId: objectId
      });
      console.log('Response from /api/liked:', response.data);
    } catch (error) {
      console.error('Error on liked:', error);
    }
  };
  ```



### 2. `/api/load_data` DO NOT USE - IGNORE

- **Purpose:** Loads data based on latitude and longitude.
- **Method:** GET
- **Parameters:**
  - \`latitude\`: Latitude of the location.
  - \`longitude\`: Longitude of the location.
- **Usage Example:**
  ```javascript
  const handleHitFor100 = async () => {
    const latitude = 34.0522;
    const longitude = -118.2437;
    try {
      const response = await axios.get(\`/api/load_data?latitude=\${latitude}&longitude=\${longitude}\`);
      console.log('Response from /api/load_data:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  ```
### 3. `/api/generate-first-swipes`

- **Purpose:** Fetches random objects for display.
- **Method:** GET
- **Usage Example:**
 ```javascript
  const fetchRandomObjects = async () => {
    try {
      const response = await axios.get('/api/generate-first-swipes');
      console.log('Random objects:', response.data);
      setRandomObjects(response.data);
    } catch (error) {
      console.error('Error fetching random objects:', error);
    }
  };
  ```

  ### 4. `/api/generate-recommendations/:clerkId`

- **Purpose:** Fetches 15 recommendations for a specific user when they are on dashboard.
- **Method:** POST
- **Parameters:**
  - \`clerkId\`: ID of the Clerk user.
- **Usage Example:**
  ```javascript
  const fetchRecommendations = async () => {
    if (user) {
      try {
        const clerkId = user.id; 
        const url = \`/api/generate-recommendations/\${clerkId}\`;
        const response = await axios.post(url);
        console.log('Recommendations:', response.data);
        setRandomObjects(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    } else {
      console.error('User not signed in');
    }
  };```

### 5. `/api/change-to-embed` DO NOT USE - IGNORE

- **Purpose:** Updates embeddings.
- **Method:** POST
- **Usage Example:**
```javascript
  const updateEmbeddings = async () => {
    try {
      const response = await axios.post('/api/change-to-embed');
      console.log('Update Embeddings Response:', response.data);
    } catch (error) {
      console.error('Error updating embeddings:', error);
    }
  };
  ```

### 6. `/api/generate-single-recommendation/:clerkId`

- **Purpose:** Fetches 1 recommendation of an item from diff places for a specific user when they expand a card.
- **Method:** POST
- **Parameters:**
  - \`clerkId\`: ID of the Clerk user.
- **Usage Example:**
```javascript
  const sendRecommendationRequest = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(\'/api/generate-single-recommendation/\${user.id}\', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
          });

          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error('Error sending recommendation request:', error);
        }
      }, (error) => {
        console.error('Error getting location', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  ```