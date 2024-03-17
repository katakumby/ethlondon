"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

import {api} from "~/trpc/react";
import {IDKitWidget, VerificationLevel} from '@worldcoin/idkit'
import {IDKitConfig, ISuccessResult, IErrorState} from '@worldcoin/idkit-core';
import {useSDK} from "@metamask/sdk-react";


// TODO: Functionality after verifying
const onSuccess = () => {
    console.log("Success")
};

export function WordCoin() {
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState("");
    const [groupAddress, setGroupAddress] = useState("");

    const [account, setAccount] = useState<string>();
    const {sdk, connected, connecting, provider, chainId} = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };

    const validateProof = api.worldId.verify.useMutation({
        onSuccess: () => {
            console.log("Lol?")
            router.refresh();
            setWalletAddress("");
        },
    })
    const verifyProof = async (proof: ISuccessResult) => {
        console.log("verifyProof", proof);
        const mutation = validateProof.mutate({
            proof: JSON.stringify({
                ...proof,
                walletAddress: walletAddress,
                groupAddress: groupAddress
            })
        });
        console.log("mutation", mutation)
        // throw new Error("TODO: verify proof server route")
    };

    return (

        <IDKitWidget
            app_id="app_staging_5b179dc5f0ba2b412b0af12ca60ce74c"
            action={groupAddress}
            // On-chain only accepts Orb verifications
            verification_level={VerificationLevel.Orb}
            handleVerify={verifyProof}
            signal={walletAddress}
            onSuccess={onSuccess}>
            {({open}) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // createPost.mutate({ name });
                    }}
                    className="flex flex-col gap-2"
                >
                    <input
                        type="text"
                        placeholder="Wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Group address"
                        value={groupAddress}
                        onChange={(e) => setGroupAddress(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />

                    <button
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                        disabled={validateProof.isPending}
                        onClick={open}
                    >
                        {validateProof.isPending ? "Joining..." : "Join group with World ID"}

                    </button>
                </form>
            )}
        </IDKitWidget>
    );
}
