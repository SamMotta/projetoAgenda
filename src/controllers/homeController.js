const Contact = require('../models/contatoModel')

exports.index = async(req, res) => {
  const contatos = await Contact.searchContacts()
  res.render('index', { contatos })
  return;
}

