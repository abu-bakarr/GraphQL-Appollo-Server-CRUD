const db = require('./db')
const {UserInputError,AuthenticationError} = require('apollo-server-express')
const person = require('./models/person');
const {resolver} = require('graphql-sequelize');
const bcrypt = require('bcrypt');


const Query = {
    jobs: () => db.jobs.list(),
    job: (root, {id}) => db.jobs.get(id),
    company: (root, {id}) => (!db.companies.get(id)) ?  
             new UserInputError(`could not find a company with id of ${id}`) : 
             db.companies.get(id),

    person: resolver(person, {get: person.id}),
    persons: resolver(person, {list: true})
    
}

const Mutation = {
  async createPerson(root,{email, password},context,info) {
  
    const saltRounds = 5;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(password, salt);

     return person.create({
        email:email,
        password:hash
    })
  },

  async login(root, { email, password  }, context) {

    const user = await person.findOne({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
      // const token = jwt.sign({ id: user.id }, 'mySecret');
      return { 
        email
       };
    }
    throw new AuthenticationError('Invalid credentials');
  },
  
 async updatePerson(root, {id,email,password}){
  const user = await person.findOne({ where: { id } });
    if (user){
      await person.update({
          email: email,
          password: password,
        },
        {
          where: { id: id }
        }
      );
      return{
        email
      }
      }
     throw new AuthenticationError('Invalid credentials');
 },

  async deletePerson(root, {id}){
    const user = await person.findOne({ where: { id } });
    // console.log(user)
    if(user) {
       await person.destroy({
        where: {
          id: id
        },
        force: true
      });
       return {id}
      }
      
     throw new AuthenticationError('User does not exist');
 }
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}



module.exports = {Query, Job, Mutation}


/*
//Query for single person
query getSinglePerson($id: ID!) {
  person(id: $id) {
    email
    id
  }
}

*/