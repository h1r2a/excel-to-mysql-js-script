const xlsx = require('xlsx');
const mysql = require('mysql2');

// 1. Charger le fichier Excel
const workbook = xlsx.readFile('sample_cvs.xlsx'); // Assure-toi que le fichier est dans le même dossier
const sheetName = workbook.SheetNames[0]; // Prend la première feuille
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet); // Convertir en JSON

console.log('Excel data loaded:', data.length, 'rows');

// 2. Connexion à MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ton utilisateur MySQL
  password: '$harena=3', // Ton mot de passe MySQL
  database: 'cv_database' // Nom de ta base de données
});

// 3. Insérer les données dans la base de données
const insertData = async () => {
  try {
    for (const row of data) {
      const query = `
        INSERT INTO cvs (name, email, phone, experience, skills, education, qualities, flaws) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        row['Name'], 
        row['Email'], 
        row['Phone'], 
        row['Experience'], 
        row['Skills'], 
        row['Education'], 
        row['Qualities'], 
        row['Flaws']
      ];

      await connection.promise().query(query, values);
      console.log('Inserted:', values);
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    connection.end();
  }
};

// Appel de la fonction
insertData();
