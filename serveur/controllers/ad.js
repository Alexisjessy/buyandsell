const db = require('../models/database.js');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');

/**
 * Function to retrieve ads for editing based on category and/or location
 */
async function editAd(req, res) {
  try {
    const { location, category } = req.query;

    let query = `
      SELECT annonce.*, image.image
      FROM annonce
      LEFT JOIN image ON annonce.id = image.annonce_id
    `;

    // filters for category and/or location if parameters are provided
    if (category) {
      query += ` WHERE annonce.category_id = ${category}`;
    }

    if (location) {
      query += ` AND annonce.location_id = ${location}`;
    }

    query += ` ORDER BY annonce.publication_date DESC`;

    const [results] = await db.query(query);

    const annonces = [];

    const annonceImages = {};

    results.forEach((row) => {
      const annonceId = row.id;

      if (!annonceImages[annonceId]) {
        annonceImages[annonceId] = {
          ...row,
          images: [],
        };
      }

      if (row.image) {
        annonceImages[annonceId].images.push(row.image);
      }
    });

    for (const annonceId in annonceImages) {
      annonces.push(annonceImages[annonceId]);
    }

    annonces.reverse();

    if (annonces.length === 0) {
      res.status(404).send('Annonce non trouvée.');
    } else {
      res.json(annonces);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'annonce :', err);
    res.status(500).send('Erreur lors de la récupération de l\'annonce.');
  }
}

      /**
       * Function to retrieve ads owned by a specific user
       */
     async function getUserAds(req, res) {
     const userId = req.session.user.id;
         const annonceId = req.params.id;
    
    try {
       
        const query = `
            SELECT annonce.*, image.image
            FROM annonce
            LEFT JOIN image ON annonce.id = image.annonce_id
            WHERE annonce.owner_id = ?
            ORDER BY annonce.publication_date DESC
        `;

        const [results] = await db.query(query, [userId]);

        const annonces = [];

        const annonceImages = {};

        results.forEach((row) => {
            const annonceId = row.id;

            if (!annonceImages[annonceId]) {
                annonceImages[annonceId] = {
                    ...row,
                    images: [],
                };
            }

            if (row.image) {
                annonceImages[annonceId].images.push(row.image);
            }
        });

        for (const annonceId in annonceImages) {
            annonces.push(annonceImages[annonceId]);
        }

        annonces.reverse();

        if (annonces.length === 0) {
            res.status(404).send('Annonce non trouvée.');
        } else {
            res.json(annonces);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces de l\'utilisateur :', err);
        res.status(500).send('Erreur lors de la récupération des annonces de l\'utilisateur.');
    }
}
    /**
     * Function to retrieve the user ID from the session
     */
    async function getUserId(req, res) {
    try {
        const userId = req.session.user.id;
        console.log(userId);

        res.status(200).json({ userId: userId });
    } catch (error) {
        console.error('Error getting user ID:', error);
        res.status(500).json({ status: 'SERVER_ERROR', message: 'Error getting user ID.' });
    }
}
   /**
    * Function to retrieve the owner ID of a specific ad
    */
   async function getOwnerByAdId(req, res) {
      const annonceId = req.params.id;

    try {
        const [result] = await db.query('SELECT owner_id FROM annonce WHERE id = ?', [annonceId]);

        if (result.length === 0) {
            res.status(404).json({ error: 'Annonce non trouvée.' });
            return;
        }

        const ownerId = result[0].owner_id;
console.log(ownerId)
        res.json({ ownerId });
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'ownerId :', err);
        res.status(500).send('Erreur lors de la récupération de l\'ownerId.');
    }
}
   /**
    *  Function to update an existing ad
    */
  async function updatePost(req, res) {
  const form = new formidable.IncomingForm({
    allowEmptyFiles: true,
    minFileSize: 0,
    multiples: true,
  });

  let fields, files;

  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    console.error(err);
    res.redirect('/account');
    return;
  }

  const title = fields.title ? fields.title[0].trim() : '';
  const description = fields.description ? fields.description[0].trim() : '';
  const price = fields.price;
  const annonceId = req.params.id;
  
  console.log('Annonce ID:', annonceId);

  if (!description || !title || !price) {
    console.log('Données manquantes (description, title, price). Redirection vers /account');
    res.redirect('/account');
    return;
  }

  const imageFiles = files.image;
  const imageUrls = [];

  if (imageFiles && imageFiles.length > 0) {
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageUrl = imageFile.newFilename + path.extname(imageFile.originalFilename);
        const newPath = 'public/images/' + imageUrl;

       try {
          fs.copyFileSync(imageFile.filepath, newPath);
          imageUrls.push(imageUrl);
        } catch (copyError) {
          console.error('Error copying file:', copyError);
          res.status(500).json({ status: 'SERVER_ERROR', message: 'Error copying image file.' });
          return;
        }
      }
    }
  }
  const userId = req.session.user.id;


 const [checkResult] = await db.query('SELECT * FROM annonce WHERE id = ? AND owner_id = ?', [annonceId, userId]);

        if (checkResult.length === 0) {
            res.status(403).send('Vous n\'avez pas le droit de mettre jour à cette annonce.');
           
            return;
        }


  const sql = `
    UPDATE annonce
    SET title = ?, description = ?, price = ?
    WHERE id = ?
  `;
  console.log('SQL:', sql);

  console.log('Données envoyées au backend:', {
    title,
    description,
    price,
    annonceId,
    imageUrls,
  });

  try {
    await db.query(sql, [title, description, price, annonceId]);



    
    const imageValues = imageUrls.map((imageUrl) => [imageUrl, annonceId]);

    if (imageValues.length > 0) {
      const query = 'INSERT INTO image (image, annonce_id) VALUES ?';
      await db.query(query, [imageValues]);
}

    console.log('Annonce mise à jour avec succès.');
    res.status(200).json({ status: 'SUCCESS', message: 'Annonce mise à jour avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'annonce :', err);
   
    res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la mise à jour de l\'annonce.' });
  }
}

    async function deleteUserAd(req, res) {
    try {
        const userId = req.session.user.id;
        const annonceId = req.params.id;

        // Check if the ad belongs to the user before removing it
        const [checkResult] = await db.query('SELECT * FROM annonce WHERE id = ? AND owner_id = ?', [annonceId, userId]);

        if (checkResult.length === 0) {
            res.status(403).send('Vous n\'avez pas le droit de supprimer cette annonce.');
            return;
        }

        await db.query('DELETE FROM annonce WHERE id = ?', [annonceId]);
        res.status(200).json({ status: 'SUCCESS', message: 'Annonce supprimée avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'annonce :', err);
        res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la suppression de l\'annonce.' });
    }
}


     async function deleteUserImage(req, res) {
         
         try {
            
              const imageId = req.params.id;
           
    
         /** Managing old images
         Delete old images associated with the ad **/
         
        await db.query('DELETE FROM image WHERE id = ?', [imageId]);
        console.log('Suppression de l\'image avec l\'ID:', imageId);
       console.log('Suppression des anciennes images...');
       
         res.status(200).json({ status: 'SUCCESS', message: 'Image supprimée avec succès.' });
        } catch (err) {
        console.error('Erreur lors de la suppression de l\'annonce :', err);
        res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la suppression de l\'image.' });
    }
}

    /**
     * Function to create a new advertisement based on form data
     */
    async function createPost(req, res) {
    const form = new formidable.IncomingForm({
        allowEmptyFiles: true,
        minFileSize: 0,
        multiples: true, 
    });

    let fields, files;

    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        console.log(err);
        res.redirect('/account');
        return;
    }

    
    const title = fields.title[0].trim();
    const description = fields.description[0].trim();
    const price = fields.price;
    const owner_id = req.session.user.id;

    
    if (!description || !title || !price) {
        res.redirect(`/account`);
        return;
    }

    
    const imageFiles = files.image;
    const imageUrls = [];

    if (imageFiles && imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
            if (imageFile && imageFile.size > 0) {
                const imageUrl = imageFile.newFilename + path.extname(imageFile.originalFilename);
                const newPath = 'public/images/' + imageUrl;
                fs.copyFileSync(imageFile.filepath, newPath);
                imageUrls.push(imageUrl);
            }
        }
    }

    
    const location_id = fields.location;
    const category_id = fields.category;

    const sql = `
        INSERT INTO annonce (title, description, price, location_id, owner_id, category_id, publication_date)
        VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))
    `;

    try {
        const [results] = await db.query(sql, [title, description, price, location_id, owner_id, category_id]);

        const annonceId = results.insertId;

        for (const imageUrl of imageUrls) {
            await db.query('INSERT INTO image (image, annonce_id) VALUES (?, ?)', [imageUrl, annonceId]);
            
        }

        res.status(200).json({ status: 'SUCCESS', message: 'Annonce créée avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la création de l\'annonce :', err);
        res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la création de l\'annonce.' });
    }
}




 
   /**
    * Function for show one Ad by id
    */
   async function editPost(req, res) {
    const annonceId = req.params.id;

    try {
        const [annonce] = await db.query('SELECT * FROM annonce WHERE id = ?', [annonceId]);
        
      
            
        const [images] = await db.query('SELECT * FROM image WHERE annonce_id = ?', [annonceId]);

       
        annonce[0].images = images;

        res.json(annonce);
        
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'annonce :', err);
        
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce.' });
    }
}



const searchAdsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;

    

      const query = `
      SELECT * FROM annonce
      WHERE title LIKE ? OR description LIKE ?;
`;

    const [result] = await db.query(query, [`%${keyword}%`, `%${keyword}%`]);

   

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la recherche d\'annonces par mots-clés :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la recherche d\'annonces.' });
  }
};



    module.exports.editPost = editPost;
    module.exports.updatePost = updatePost;
    module.exports.getUserId = getUserId;
    module.exports.getOwnerByAdId = getOwnerByAdId;
    
    module.exports.createPost = createPost;
    module.exports.editAd = editAd;
    module.exports.getUserAds = getUserAds;
    module.exports.deleteUserAd = deleteUserAd;
    module.exports.deleteUserImage = deleteUserImage;
    module.exports. searchAdsByKeyword =  searchAdsByKeyword;