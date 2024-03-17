import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const worldIdRoute = createTRPCRouter({
    verify: publicProcedure
        .input(z.object({proof: z.string().min(1)}))
        .mutation(async ({ctx, input}) => {
            // simulate a slow db call
            const proof = JSON.parse(input.proof);

            const reqBody = {
                merkle_root: proof.merkle_root,
                nullifier_hash: proof.nullifier_hash,
                proof: proof.proof,
                verification_level: proof.verification_level,
                action: process.env.NEXT_PUBLIC_WLD_ACTION_ID,
                signal: proof.walletAddress, // if we don't have a signal, use the empty string
            }

            console.log("Got groupAddress", proof.groupAddress);
            console.log("Got proof", proof);
            console.log("Got reqBody", reqBody);
            const verifyRes = await fetch(`https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            })/*.then(verifyRes => {
                verifyRes.json().then(wldResponse => {
                    if (verifyRes.status == 200) {
                        // this is where you should perform backend actions based on the verified credential
                        // i.e. setting a user as "verified" in a database
                        res.status(verifyRes.status).send({ code: 'success' })
                    } else {
                        // return the error code and detail from the World ID /verify endpoint to our frontend
                        res.status(verifyRes.status).send({
                            code: wldResponse.code,
                            detail: wldResponse.detail,
                        })
                    }
                })
            })*/
            console.log(await verifyRes.json())

            return true
        }),

});
