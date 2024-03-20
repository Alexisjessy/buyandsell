const db = require('../models/database.js');

async function getCategoriesByLocation(req, res) {
  const locationId = req.params.location_id;
  const { category: categoryId } = req.query;

  let sql = `
    SELECT DISTINCT c.id AS category_id, c.category_name
    FROM category c
    INNER JOIN annonce a ON c.id = a.category_id
    WHERE a.location_id = ?;
  `;

  if (categoryId) {
    sql += ' AND c.id = ?';
  }

  try {
    const params = categoryId ? [locationId, categoryId] : [locationId];
    const [categories] = await db.query(sql, params);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories by location:', error);
    res.status(500).send('Error fetching categories by location.');
  }
}

module.exports.getCategoriesByLocation = getCategoriesByLocation;
