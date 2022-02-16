const Contact = require('../models/contatoModel')

exports.index = (req, res) => {
  res.render('contact', { contato: {} });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contact(req.body)
    await contato.register()

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors)
      req.session.save(() => res.redirect('/contato'))
      return;
    }

    req.flash('success', 'Contato registrado com sucesso.')
    req.session.save(() => res.redirect(`/contato/${contato.contato._id}`))
    return;
  } catch (err) {
    console.error(err)
    return res.render('404')
  }
}

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404')

  const contato = await Contact.IdSearch(req.params.id)
  if (!contato) return res.render('404')

  res.render('contact', { contato })
}


exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render('404')
    const contato = new Contact(req.body)
    await contato.edit(req.params.id)

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors)
      req.session.save(() => res.redirect('/contato'))
      return;
    }

    req.flash('success', 'Contato editado com sucesso.')
    req.session.save(() => res.redirect(`/contato/${contato.contato._id}`))
    return;

  } catch (err) {
    console.error(err)
    return res.render('404')
  }
}

exports.delete = async (req, res) => {
  if(!req.params.id) return res.render('404')
  const contato = await Contact.delete(req.params.id)
  if(!contato) return res.render('404')
  
  req.flash('success', 'Contato apagado com sucesso')
  req.session.save(() => res.redirect('/'))
  return;
}