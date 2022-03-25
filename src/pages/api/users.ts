import { NextApiRequest, NextApiResponse } from 'next'

// JWT (Storage)
// Next Auth (Social(google, github, etc..))  ---> Usar esse pela simplicidade da aplicação e integração mais fácil com o gitHub
// Cognito, Auth0 

export default (request: NextApiRequest, response: NextApiResponse) => {
     const users = [
         { id: 1, name: 'Abraão'},
         { id: 2, name: 'Diego'},
         { id: 3, name: 'Dani'},
     ]

     return response.json(users)
}