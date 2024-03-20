

const db = require('../models/database.js');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');

  const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const [user] = await db.query('SELECT * FROM \`user\`  WHERE id = ?', [userId]);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



    const updateUserProfile = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    let fields, files;

    try {
      [fields, files] = await form.parse(req);
    } catch (err) {
      console.log(err);
      res.redirect('/admin');
      return;
    }

    const phoneNumber = fields.phoneNumber;
    console.log(phoneNumber);

    const imageFile = files.profilePhoto;
const imageUrl = [];

if (imageFile && imageFile.length > 0) {
  for (const file of imageFile) {
    if (file && file.size > 0) {
      const newImageUrl = file.newFilename + path.extname(file.originalFilename);
      const newPath = 'public/images/' + newImageUrl;
      fs.copyFileSync(file.filepath, newPath);
      imageUrl.push(newImageUrl);
    }
  }
}


    const userId = req.session.user.id;

    await db.query('UPDATE user SET profile_photo = ?, phone_number = ? WHERE id = ?', [
  imageUrl.length > 0 ? imageUrl[0] : null, 
  phoneNumber,
  userId,
]);


    console.log('Données de profil reçues!');
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


 const getProfileRatings = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const rows = await db.query(`
      SELECT e.comment, e.score, e.send_date, u.username
      FROM evaluation e
      JOIN user u ON e.rater_id = u.id
      WHERE e.rated_user_id = ?
    `, [ownerId]);

    

    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


   const addRating = async (req, res) => {
  try {
    const { comment, score } = req.body;
    const userId = req.session.user.id;
    const ownerId = req.params.id;

    await db.query(
      'INSERT INTO evaluation (rater_id, rated_user_id, comment, score, send_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [userId, ownerId, comment, score]
    );

    res.status(201).json({ message: 'Rating added successfully' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 module.exports.getUserProfile = getUserProfile;
 module.exports.updateUserProfile = updateUserProfile;
 module.exports.getProfileRatings = getProfileRatings;
 module.exports.addRating = addRating;