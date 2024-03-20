const db = require('../models/database.js');

async function list(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM category');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Error fetching categories.');
  }
}

async function listWithAd(req, res) {
  try {
    const [categoryResult] = await db.query('SELECT id AS category_id, category_name FROM category WHERE id = ?', [
      req.params.id,
    ]);

    if (!categoryResult.length) {
      return res.status(404).send('Category not found.');
    }

    const category = {
      id: categoryResult[0].category_id,
      category_name: categoryResult[0].category_name,
      annonces: [],
    };

    const [annonceResult] = await db.query(
      'SELECT a.*, i.image FROM annonce a LEFT JOIN image i ON a.id = i.annonce_id WHERE a.category_id = ?',
      [req.params.id]
    );

    annonceResult.forEach((row) => {
      category.annonces.push({
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        publication_date: row.publication_date,
        location_id: row.location_id,
        images: row.image ? [row.image] : [],
      });
    });

    res.json(category);
  } catch (error) {
    console.error('Error fetching category with ads:', error);
    res.status(500).send('Error fetching category with ads.');
  }
}

module.exports.list = list;
module.exports.listWithAd = listWithAd;
