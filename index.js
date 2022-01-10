const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP
const { buildSchema } = require('graphql')
let pokemons = require('./pokemons.json')

// esquema de graphql
const schema = buildSchema(`
  type Query {
    message: String
    pokemon(id: Int!): Pokemon
    pokemons(power: Int!): [Pokemon]
  },
  type Mutation {
      updatePower(id: Int!, power: Int!): Pokemon
  },
  type Pokemon {
    id: Int,
    name: String,
    power: Int,
    abilities: [String]
  }
`)

// para los query
const getMessage = () => 'HELLO POKEMON'
const getPokemon = ({ id }) =>
  pokemons.filter((pokemon) => pokemon.id === id)[0] || []
const getPokemons = ({ power }) =>
  pokemons.filter((pokemon) => pokemon.power === power)
// para la mutación
const updatePower = ({ id, power }) => {
  pokemons.map((pokemon) => {
    if (pokemon.id === id) {
      pokemon.power = power
    }
    return pokemon
  })
  return getPokemon({ id })
}

const root = {
  message: getMessage,
  pokemon: getPokemon,
  pokemons: getPokemons,
  updatePower: updatePower,
}

// creamos el servidor express con graphql en el endpoint /graphql
const app = express()
const port = 4000
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

app.listen(port, () =>
  console.log(`Servidor graphql corriendo en http://localhost:${port}/graphql`)
)
