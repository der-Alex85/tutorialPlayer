module.exports = {

  // hidding password
  schema: true,

	attributes: {
		user:  { type: 'string', required: true },
		kurs:  {type: 'string', required: true },
		satz:  {type: 'string' },
		folie: {type: 'string' },
		file:  {type: 'string' }
	}
}