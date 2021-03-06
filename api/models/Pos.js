module.exports = {

  // hidding password
  schema: true,

	attributes: {
		user:  { type: 'string', required: true },
		kurs:  {type: 'string', required: true },
		satz:  {type: 'string' },
		indexh: {type: 'string' },
		indexv: {type: 'string' },
		file:  {type: 'string' },

		notizen: {
      collection: 'Notiz',
      via: 'pos'
    },

    fragen: {
        collection: 'Frage',
        via: 'pos'
    }
	}
}