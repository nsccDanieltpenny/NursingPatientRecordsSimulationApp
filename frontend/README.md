# Nursing Records Sim
#### Frontend
<hr />

## Requirements
<hr/>

### Node
For development, you will need Node.js installed in your environment. [Node.js](https://nodejs.org/en) is simple to install. Once the installation procedure is complete run:

```sh
$ node --version

$ npm --version
```

## Dependencies
<hr />
- Axios<br>
- Bootstrap / Bootstrap-icons<br>
- react<br>
- react-dom<br>
- react-router<br>
- semver<br>
- vite<br>

To install all dependencies, run the following command:

```sh
$ npm install 
```

## Project Structure
<hr />
The project structure is a typical React app layout. Here's a small overview of the file structure:

```sh
├── public
│   ├── index.html
├── src
│   ├── routes
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── WeatherForecast-test.jsx
│   ├── ui
│   │   ├── Nav.jsx
|   |   ├── PatientCard.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── package.json
```

## Running the Application
To run the app,
```sh
$ npm run dev
```

Then open http://localhost:3000 to view it in the browser. The page will reload if you make edits, and you will see any lint errors in tha console.

## Sample Code

The patient data is being fetched with this state function:

```js
useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Patient data...');
        const response = await axios.get('http://localhost:5232/patient');
        console.log('Response:', response);
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, []);
```

The backend is set to localhost:5232, ensure it's running and pull data from apis. 
