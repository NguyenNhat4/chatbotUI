import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// Dummy user database - In a real app, you would use a database
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@medical.com",
    // This is a hashed version of "password"
    password: "$2b$10$z.3531LeXCY1WEq3dzoHe.alSCdlAhVqagk04vEMF4waNtTbW0Mh6",
  },
];

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Find the user with the matching email
        const user = users.find(user => user.email === credentials.email);
        
        // If user not found or password doesn't match, return null
        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }
        
        // Return the user object (without password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
