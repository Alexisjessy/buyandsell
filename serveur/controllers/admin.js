const db = require('../models/database.js');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');


function isAdmin(req, res, next) {
    if (req.session && req.session.connected && req.session.user && req.session.user.admin) {
        return next(); // L'utilisateur est authentifié ET admin, on peut afficher la page
    } else {
        return res.status(401).send('401 Unauthorized'); // L'utilisateur n'est pas authentifié, on retourne une erreur 401
    }
}
async function getAllAds(req, res) {
  try {
  
   

    const query = `
      SELECT annonce.*, image.image
      FROM annonce
      LEFT JOIN image ON annonce.id = image.annonce_id
      ORDER BY annonce.publication_date DESC
    `;

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
      res.status(404).send('Aucune annonce trouvée.');
    } else {
      res.json(annonces);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de toutes les annonces :', err);
    res.status(500).send('Erreur lors de la récupération de toutes les annonces.');
  }
}


async function adminUpdatePost(req, res) {
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



    // Insérer les nouvelles images associées à l'annonce
    const imageValues = imageUrls.map((imageUrl) => [imageUrl, annonceId]);
// Insérer les nouvelles images associées à l'annonce
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

   async function adminDeleteUserAd(req, res) {
    const annonceId = req.params.id;

    try {
        // Vérifiez si l'utilisateur est un administrateur
        isAdmin(req, res, async () => {
            // Continuez avec la suppression de l'annonce ici
            await db.query('DELETE FROM annonce WHERE id = ?', [annonceId]);
            res.status(200).json({ status: 'SUCCESS', message: 'Annonce supprimée avec succès.' });
        });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'annonce par l\'administrateur :', err);
        res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la suppression de l\'annonce.' });
    }
}



async function getAllComments(req, res) {
  try {
    const query = `
      SELECT evaluation.*, user.username AS rated_username
      FROM evaluation
      LEFT JOIN user ON evaluation.rated_user_id = user.id
      ORDER BY evaluation.send_date DESC
    `;

    const [results] = await db.query(query);

    if (results.length === 0) {
      res.status(404).send('Aucun commentaire trouvé.');
    } else {
      res.json(results);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de tous les commentaires :', err);
    res.status(500).send('Erreur lors de la récupération de tous les commentaires.');
  }
}



async function adminDeleteComment(req, res) {
  const commentId = req.params.id;

  try {
    
    isAdmin(req, res, async () => {
    
      await db.query('DELETE FROM evaluation WHERE id = ?', [commentId]);
      res.status(200).json({ status: 'SUCCESS', message: 'Commentaire supprimé avec succès.' });
    });
  } catch (err) {
    console.error('Erreur lors de la suppression du commentaire par l\'administrateur :', err);
    res.status(500).json({ status: 'SERVER_ERROR', message: 'Erreur lors de la suppression du commentaire.' });
  }
}



module.exports.getAllAds = getAllAds;

module.exports.adminUpdatePost = adminUpdatePost;
module.exports.adminDeleteUserAd = adminDeleteUserAd;

module.exports.getAllComments = getAllComments;
module.exports.adminDeleteComment = adminDeleteComment;


    