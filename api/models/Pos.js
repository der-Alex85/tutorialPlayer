module.exports = {

  // hidding password
  schema: true,

	attributes: {
		user:  { type: 'string', required: true },
		kurs:  {type: 'string', required: true },
		satz:  {type: 'string', required: true },
		folie: {type: 'integer', required: true }
	}
}