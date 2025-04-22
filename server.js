const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const poolConfig = {
  waitForConnections: true,
  connectionLimit: 10,     
  host: process.env.DB_HOST,    
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 3306, //parseInt(process.env.DB_PORT || '3306', 10),
  //multipleStatements: true
};

const poolConnection = mysql.createPool(poolConfig);  


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


app.get("/api/ricette", async (req, res) => {  //------------------FATTO

  const { limit, name, categoria, tag } = req.query;

  try {
    if (limit && isNaN(Number(limit))) {
      return res.status(400).json({ error: "Il parametro limit deve essere un numero" });
    }

    let query = 'SELECT * FROM ricette WHERE 1=1';
    const params = [];

    // Filtro per nome 
    if (name) {
      query += ' AND LOWER(strMeal) LIKE ?';
      params.push(`%${name.toString().toLowerCase()}%`);
    }

    // Filtro per categoria
    if (categoria) {
      query += ' AND LOWER(strCategory) = ?';
      params.push(categoria.toString().toLowerCase());
    }

    // Filtro per tag (con gestione dei NULL)
    if (tag) {
      query += ' AND (strTags IS NOT NULL AND LOWER(strTags) LIKE ?)';
      params.push(`%${tag.toString().toLowerCase()}%`);
    }

    // Aggiungi ordinamento (opzionale)
    //query += ' ORDER BY strMeal ASC';

    //ordinamento casuale
    query += ' ORDER BY RAND()'

    // Aggiungi limite (dopo tutti i filtri)
    if (limit) {
      query += ' LIMIT ?;';
      params.push(limit);
    }
   
    const [result] = await poolConnection.execute(query, params); 

    res.status(200).json({
      error: null,
      success: true, 
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Errore imprevisto in  getRicette',
      success: false,
      data: null
    });
  }
});





app.get("/api/ricetta/:idMeal/:idUtente", async (req, res) => {   //------------Fatto senza stored Procedure
  const { idMeal, idUtente } = req.params;
  try {
    
    const query = 'CALL GetRicettaCompleta(?, ?)'

    const values = [idMeal, idUtente];

    const [result] = await poolConnection.execute(query, values);

    const [ricetta, ingredienti, lista_spesa] = result;

    const ricettaCompleta = {
      ...ricetta[0],
      ingredienti: ingredienti || [],
      lista_spesa: lista_spesa || [] 
    };

    console.log('ric comoleta: ', ricettaCompleta)

    res.status(200).json({
      error: null,
      success: true, 
      data: ricettaCompleta
    }); 

  } catch (error) {
    res.status(500).json({
        error: 'Errore imprevisto in  Ricetta Completa',
        success: false,
        data: null
    });
  }

});


app.get("/api/category", async(req, res) => {    //------------Fatto
  try {
    const query = 'SELECT * FROM categorie;';

    const [result] = await poolConnection.execute(query);

    res.status(200).json({
      error: null,
      success: true, 
      data: result
    });

  } catch (error) {
    res.status(500).json({
      error: 'Errore imprevisto in get Categorie',
      success: false,
      data: null
  });
  }
   
});

app.post('/api/toggle-preferito', async (req, res) => {  //-------Fatto
  try {
    const { idUtente, idMeal } = req.body;

    const [existing] = await poolConnection.query(
      'SELECT idPreferito FROM preferiti WHERE idUtente = ? AND idMeal = ?;',
      [idUtente, idMeal]
    );
    
    if (existing.length > 0) {
      await poolConnection.query('DELETE FROM preferiti WHERE idPreferito = ?;', existing[0].idPreferito);
    } else {
      await poolConnection.query('INSERT INTO preferiti (idUtente, idMeal) VALUES (?, ?);', [idUtente, idMeal]);
    } 
    
    res.status(200).json({ 
      data: null,
      success: true, 
      error: null 
    });
  } catch (error) {
    console.log('sto in errore')
    res.status(500).json({
      data: null,
      success: false,
      error: 'Errore interno del server'
    });
  }
});


app.get("/api/getPreferiti", async (req, res) => {     //------NON USATO-----------------
  const { idUtente } = req.query;
  
   try {
    const query = `SELECT idMeal FROM preferiti WHERE idUtente = ?`; 
    const values = [idUtente];

    const [result] = await poolConnection.execute(query, values);
    
    res.status(200).json({
      error: null,
      success: true, 
      data: result
    });

  } catch (error) {    
    res.status(500).json({
        error: 'Errore imprevisto in GET id Preferiti',
        success: false,
        data: null
    });
  } 
}); 

app.get("/api/getRicettePreferite", async (req, res) => {   //------------Fatto
  const { idUtente } = req.query;
  
   try {
    const query = `SELECT r.* FROM ricette r
                    INNER JOIN preferiti p ON r.idMeal = p.idMeal
                    WHERE p.idUtente = ?`; 
    const values = [idUtente];

    const [result] = await poolConnection.execute(query, values);    

    res.status(200).json({
      error: null,
      success: true, 
      data: result
    });

  } catch (error) {    
    res.status(500).json({
        error: 'Errore imprevisto in Aggiungi Preferiti',
        success: false,
        data: null
    });
  } 
});

app.post('/api/lista_spesa', async (req, res) => {  //------------------Fatto
  try {
    const { idUtente, idMeal, idIngrediente, ingrediente, quantita, insert } = req.body;

    if (insert) {
      await poolConnection.execute('INSERT INTO lista_spesa (idUtente, idMeal, idIngrediente, ingrediente, quantita) VALUES (?, ?, ?, ?, ?);', [idUtente, idMeal, idIngrediente, ingrediente, quantita]);
    } else {
      await poolConnection.execute('DELETE FROM lista_spesa WHERE idUtente = ? AND idMeal = ? AND idIngrediente = ?;', [idUtente, idMeal, idIngrediente]);
    } 
        
    res.status(200).json({ 
      data: null,
      success: true, 
      error: null 
    });
  } catch (error) {
    console.log('sto in errore')
    res.status(500).json({
      data: null,
      success: false,
      error: 'Errore interno del server'
    });
  }
});

app.get("/api/lista_spesa/:idUtente", async (req, res) => {   //-------------Fatto
  const { idUtente } = req.params;
  try {
    
    const query = 'CALL GetListaSpesaConRicette(?)'

    const values = [idUtente];

    const [result] = await poolConnection.execute(query, values);

    const [ricetta] = result;

      if (!result || !Array.isArray(ricetta)) {
      return res.status(404).json({ 
        error: 'Nessun dato trovato', 
        success: false 
      });
    }  

    // Converti ogni ricetta e i suoi ingredienti
    const ricetteConBoolean = ricetta.map(ricetta => ({
      ...ricetta,
      listaSpesa: ricetta.listaSpesa.map(ingrediente => ({
        ...ingrediente,
        acquistato: ingrediente.acquistato === 1 // Converti 0/1 in false/true
      }))
    }));

    res.status(200).json({
      error: null,
      success: true, 
      data: ricetteConBoolean //ricettaConLista
    }); 

  } catch (error) {
    res.status(500).json({
        error: 'Errore imprevisto in  RicettaByID',
        success: false,
        data: null
    });
  }

});


app.post('/api/acquistato-toggle', async (req, res) => {  //---------------Fatto
  try {
    const { idUtente, idLista } = req.body;

    const [result] = await poolConnection.query(
      'SELECT acquistato FROM lista_spesa WHERE idUtente = ? AND idLista = ?;',
      [idUtente, idLista]
    );

    const [ acquistato ] = result;
    
    if (!acquistato.acquistato) { //fai update con acq=1
      await poolConnection.query('UPDATE lista_spesa SET acquistato = true WHERE idLista = ?;', idLista);
    } else { //fai update con acq=0
      await poolConnection.query('UPDATE lista_spesa SET acquistato = false WHERE idLista = ?;', idLista);
    }  
      
    res.status(200).json({ 
      data: null,
      success: true, 
      error: null 
    });
  } catch (error) {
    console.log('sto in errore')
    res.status(500).json({
      data: null,
      success: false,
      error: 'Errore interno del server'
    });
  }
});


app.post('/api/lista_spesa/elimina', async (req, res) => {   //-------------Fatto
  try {
    const { ids } = req.body;

    console.log('id Ricevuti: ', ids)

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Deve essere fornito un array di ID valido' 
      });
    }

     
    // Crea un placeholders string (?,?,?) basato sul numero di IDs
    const placeholders = ids.map(() => '?').join(',');
    
    const query = `DELETE FROM lista_spesa WHERE idLista IN (${placeholders})`;
    
    // Esegui la query con gli IDs come parametri
    const [result] = await poolConnection.execute(query, ids);
    
    res.status(200).json({ 
      data: null,
      success: true, 
      error: null 
    });
  } catch (error) {
    console.log('sto in errore')
    res.status(500).json({
      data: null,
      success: false,
      error: 'Errore interno del server'
    });
  }
});








// Avvio del server
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});