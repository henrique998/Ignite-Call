/* eslint-disable prettier/prettier */
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import { Adapter } from "next-auth/adapters"
import { destroyCookie, parseCookies } from "nookies"
import { prisma } from "../prisma"

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res']
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User id not found on cookies!')
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        }
      })

      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/'
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email!,
        avatar_url: updatedUser.avatar_url!,
        emailVerified: null
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider_account_id: providerAccountId,
            provider,
          }
        },
        include: {
          user: true
        }
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null
      }
    },

    async updateUser(user) {
      const userUpdated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url
        }
      })

      return {
        id: userUpdated.id,
        name: userUpdated.name,
        username: userUpdated.username,
        email: userUpdated.email!,
        avatar_url: userUpdated.avatar_url!,
        emailVerified: null
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state
        }
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          session_token: sessionToken,
          user_id: userId,
          expires
        }
      })

      return {
        sessionToken,
        userId,
        expires
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken
        },
        include: {
          user: true
        }
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          avatar_url: user.avatar_url!,
          emailVerified: null
        },
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id
        }
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const sessionUpdated = await prisma.session.update({
        where: {
          session_token: sessionToken
        },
        data: {
          user_id: userId,
          expires
        }
      })

      return {
        sessionToken: sessionUpdated.session_token,
        expires: sessionUpdated.expires,
        userId: sessionUpdated.user_id
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken
        }
      })
    }
  }
}