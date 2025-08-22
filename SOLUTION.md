### My Approach to the Solution

I focused on making the application more robust, performant, and easier to work with, without breaking what was already working. Here's a breakdown of the key changes:

**Stopped Blocking the Server:** I swapped out the old synchronous file reading for a modern, non-blocking approach. This means the server can handle other requests while it's waiting for file operations to finish. I also made file writes atomic, which greatly reduces the chance of the data file getting corrupted if something goes wrong.

**Sped Up the Stats Page:** The stats endpoint was recalculating everything on every visit, which is inefficient. I implemented a simple cache that only recalculates the numbers when it detects that the underlying data file has actually changed.

**Added Pagination (Without Breaking Things):** I introduced a new way to fetch the list of items with pagination (`?paginate=true&page=1&limit=10`). The old endpoint still returns a simple array, so any existing apps or frontend code that rely on it won't suddenly break. This lets teams adopt the new feature at their own pace.

**Better Error Handling:** I replaced the custom error handling with a more standard Express.js setup. This makes errors easier to track and provides clearer, more consistent messages back to the client, especially when someone submits an invalid item.

**Made the Frontend More Resilient:** The React app now cancels outgoing API requests if a user navigates away from a page before it finishes, preventing weird errors. I also set it up to use relative paths for API calls, which seamlessly works with Create React App's built-in proxy to talk to our backend.

**Improved the Project Structure:** I moved the core Express app setup into its own file. This makes it much cleaner to import and use for testing, without having to actually start a server on a real port.

### Testing

**Backend Tests:** I used Jest and Supertest to write tests that check all the important endpoints (`/health`, getting items, posting new ones, and the stats) to make sure they respond correctly.
**Frontend Tests:** The React tests now use mocked `fetch` calls. This means the tests run quickly and reliably because they don't need a real network connection or a running backend server.

### Trade-offs and Considerations

This solution is great for the current needs, but here are a few things to keep in mind for the future:

*   The cache is in-memory, so it will reset every time the server restarts. For a production app with multiple servers, you'd want a shared cache like Redis.
*   Using a JSON file for data is simple but doesn't handle multiple simultaneous writes very well. A real database would be the next step for a more serious application.
*   Pagination is optional for now. A future version could make it the default and return the same structured response for all list endpoints.
*   The input validation works but is basic. Using a validation library would make it more powerful and easier to maintain.

### How to Run It

Getting everything up and running is straightforward:

**Backend (runs on port 3001):**
```bash
cd backend
npm install
npm start    # Starts the server
npm test     # Runs the backend tests
```

**Frontend (runs on port 3000 and talks to the backend):**
```bash
cd ../frontend
npm install
npm start    # Starts the React dev server
npm test     # Runs the frontend tests
```

### Trying Out the New Pagination Feature

The new paginated view is hidden behind a feature flag so we don't disrupt the current experience. To turn it on, you need to set an environment variable before starting the frontend:

**On Mac/Linux:**
```bash
REACT_APP_USE_PAGINATION=true npm start
```

**On Windows (PowerShell):**
```bash
$env:REACT_APP_USE_PAGINATION='true'; npm start
```