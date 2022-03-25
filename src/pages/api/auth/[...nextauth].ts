import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";

import { fauna } from '../../../services/fauna'

export default NextAuth({

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: 'read:user' }
      }
    })
  ],
 
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // console.log(user)  LEMBRAR QUE ESSE CONSOLELOG SÓ SERÁ VISTO NO CONSOLE DAQUI DO VSCODE, POIS AS INFORMAÇÕES DA PASTA API NÃO SÃO VISTAS NO BROWSER

      const { email } = user

      try {
        

        await fauna.query(
          q.If(  // verifcar se o login já existe no banco de dados
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true

      } catch {
        return false
      }


    },
  }
})