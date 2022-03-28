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
    async session({ session }) {

      try {
        const userActiveSubscription = await fauna.query(
          q.Get( // pegar
            q.Intersection([ // Usando isso para pegar a intersecção, ou seja, o usuário que está com status ativo e que corresponda com o match do user ref
              q.Match(  // que dê "match"
                q.Index('subscription_by_user_ref'), // com esse. "depois da virgula coloca o outro"
                q.Select( // selecionar
                  "ref",  // ref. "depois da virgula colocar o elemento do qual quer pegar o ref dele"
                  q.Get(  // pegar
                    q.Match(  // que dê "match"
                      q.Index('user_by_email'),  // com esse. "depois da vírgula coloca o outro"
                      q.Casefold(session.user.email)
                    )
                  )
                )

              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },

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