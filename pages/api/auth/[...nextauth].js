import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: "577924048037-g61kmc39r6lgpgctg021atf3sglv15dm.apps.googleusercontent.com",
            clientSecret: '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'
        }),
    ],
    secret: '234aa4890565099b1f697a2982e6650e',
    // debug: true,
  
})