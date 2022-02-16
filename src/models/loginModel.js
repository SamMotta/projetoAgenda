const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }

    async login() {
        this.valida()
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email })

        if(!this.user) {
            this.errors.push('Usuário ou senha inválidos')
            return;
        }


        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Usuário ou senha inválidos')
            this.user = null
            return;
        }
    
    }

    async register() {
        this.valida()
        if(this.errors.length > 0) return;
        
        await this.userExists()
        
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        this.user = await LoginModel.create(this.body)
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email }) 
        if(this.user) this.errors.push('Usuário já existe.')
    }

    valida() {
        this.cleanData()

        // Email precisa ser valido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
        // senha precisa ser entre 8 e 12 caracteres
        if(this.body.password.length < 8 || this.body.password.length >= 12) this.errors.push('A senha precisa ter entre 8 e 12 caracteres.')
        // Validação
    }

    cleanData() {
        for (const i in this.body) {
            if (typeof this.body[i] !== 'string') {
                this.body[i] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
            // garantindo que o CSRF não vá pra base de dados
        }
    }
}

module.exports = Login;
