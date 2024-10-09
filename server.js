const express = require('express');  // For handling HTTP requests
const sql = require('mssql');        // For Azure SQL connection
const app = express();

// Azure SQL connection configuration
const config = {
    user: 'test',                               // Your SQL username
    password: '1234very_strong_password',       // Your SQL password
    server: 'avy1013.database.windows.net',
    database: 'avy',                            // Your database name
    options: {
        encrypt: true                           // Use encryption for Azure SQL
    }
};

// Connect to Azure SQL Database
sql.connect(config, (err) => {
    if (err) {
        console.error('Error connecting to Azure SQL:', err);
        return;
    }
    console.log('Connected to Azure SQL Database');
});

// Example endpoint to fetch manhwa data from the database
app.get('/', (req, res) => {
    const query = 'SELECT id, title, genre, description, image_url FROM Manhwa'; // Ensure these columns match your DB schema
    
    sql.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(result.recordset); // Send the data to the frontend
    });
});

// Serve static files (frontend) from the 'public' directory
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});