# Flight Routes API

This project provides a simple API to fetch flight routes between cities, built using **Flask** and **MongoDB**. The API is initialized with dummy data for flights between New Delhi (DEL) and New York City (JFK). 

---

## Prerequisites

1. **Python 3.7+** installed.
2. **MongoDB** installed and running locally on port `27017`.
3. **Flask** and **PyMongo** Python packages installed.

---

## Setup Instructions

### 1. Clone the Repository
```bash
    git clone <repository_url>
    cd <repository_folder>
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install flask pymongo
    brew tap mongodb/brew
    brew install mongodb-community@6.0
    brew services start mongodb/brew/mongodb-community
    pip install flask pymongo
    python app.py
```

### 2. Test the API
Use the /get-routes endpoint to fetch flight routes. You can test it using a browser, Postman, or curl.

```bash
curl "http://127.0.0.1:5000/get-routes?source=DEL&destination=JFK"
```

### 3. Run the Flask Application
Execute the app.py script to start the application:

```bash
python app.py
```

### 4. Access the Application
Open your browser and navigate to http://127.0.0.1:5000 to access the app.

### 5. Steps to Run the React UI on a CORS-Disabled Browser

**Navigate to the React Project Directory**  
   Open a terminal or command prompt and change the directory to where your React project is located:
   ```bash
   cd <react_project_folder>
npm ci
npm start
```

### 6. Disable CORS for Your Browser
Open a CORS-disabled instance of your browser. This is useful when testing locally without dealing with CORS issues.

For Google Chrome:
Close all open Chrome instances.
Open a terminal and run the following command to launch Chrome with CORS disabled:

```bash
chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

### Step 7: Use the React UI to Search for Routes

1. Open the React application in your browser (running at [http://localhost:3000](http://localhost:3000)).
   
2. Enter the **source** and **destination** cities or airport codes (e.g., "DEL" for New Delhi and "JFK" for New York City) in the input fields provided.

3. Click on the **Search Route** button to fetch flight route data.

4. The React application will send a request to the backend API (`/get-routes`) and display the available routes in the UI.

5. Verify that the displayed flight routes match the expected results based on the dummy data.

If you encounter any issues, ensure the backend (`app.py`) is running and that MongoDB is active. Check the browser's developer console for any errors or warnings.
