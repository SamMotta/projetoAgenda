const mongoose = require('mongoose');
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phoneNumber: { type: String, required: false, default: '' },
  createdAt: { type: Date, default: Date.now()}
});

const ContactModel = mongoose.model('Contact', ContactSchema);

// função construtora
// NUNCA USAR ARROW FUNCTIONS EM FUNÇÕES CONSTRUTORAS
function Contact(body) {
  this.body = body
  this.errors = []
  this.contact = null
}

Contact.prototype.register = async function() {
  this.valida()

  if(this.errors.length > 0) return;

  this.contato = await ContactModel.create(this.body)

}

Contact.prototype.valida = function() {
  this.cleanData()

  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.name) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.email && !this.body.phoneNumber) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
  }
}

Contact.prototype.edit = async function(id){
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
}

Contact.prototype.cleanData = function() {
  for (const i in this.body) {
      if (typeof this.body[i] !== 'string') {
          this.body[i] = '';
      }
  }

  this.body = {
      name: this.body.name,
      surname: this.body.surname,
      email: this.body.email,
      phoneNumber: this.body.phoneNumber
  }
}

// Estáticos
Contact.IdSearch = async function (id) {
  if(typeof id !== 'string') return;

  const contact = await ContactModel.findById(id)
  return contact
}

Contact.searchContacts = async function () {
  const contatos = await ContactModel.find()
  .sort({ createdAt: -1})
  return contatos
}

Contact.delete = async function (id) {
  if(typeof id !== 'string') return;
  const contato = await ContactModel.findOneAndDelete({_id: id})
  return contato
}


module.exports = Contact;
