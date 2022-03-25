import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react'
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb'
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id: string
    }
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const session = await getSession({ req }) // pegar a sessão do usuário no lado do backend. Já que não dá de usar o useSession, pois só da pra usar lá no react, não no API routes, aqui.

        const user = await fauna.query<User>(  // pegando o usuário de acordo com o email do fauna que seja igual ao email do auth do github
            q.Get(  // pegar email do fauna
                q.Match(    // que dê "match"
                    q.Index('user_by_email'), // no index 'user_by_email
                    q.Casefold(session.user.email) //com o email do session.user.emailEmail do auth github
                )
            )
        )

        let customerId = user.data.stripe_customer_id // vai dar erro de tipagem, só tipar lá em cima

        if (!customerId) {

            const stripeCustomer = await stripe.customers.create({ // criação do usuuário no Stripe
                email: session.user.email,
                // metadata
            })

            // salvar o id do stripe no fauna
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),  // '.ref' vai da erro então faz a tipagem lá em cima
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId, // usuário que vai comprar. Mas antes precisa criar lá em cima. É o id do usuário NO STRIPE E NÃO NO FAUNA
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{ price: 'price_1Kbx04Jjbo3sRdLsxHtXrJiV', quantity: 1 }], // preço lá do index
            mode: 'subscription',  // pagamento recorrente
            allow_promotion_codes: true, // poder criar um cupom de desconto
            success_url: process.env.STRIPE_SUCESS_URL,  // pra onde redirecionar qnd der certo
            cancel_url: process.env.STRIPE_CANCEL_URL // pra onde redirecionar qnd der errado
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}