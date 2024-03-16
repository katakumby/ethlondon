"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { IDKitConfig, ISuccessResult, IErrorState } from '@worldcoin/idkit-core';

const verifyProof = async (proof:ISuccessResult) => {
  console.log("verifyProof",proof);
  throw new Error("TODO: verify proof server route")
};

// TODO: Functionality after verifying
const onSuccess = () => {
  console.log("Success")
};
export function WordCoin() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
      <IDKitWidget
          app_id="app_staging_5b179dc5f0ba2b412b0af12ca60ce74c"
          action="testx"
          // On-chain only accepts Orb verifications
          verification_level={VerificationLevel.Orb}
          handleVerify={verifyProof}
          onSuccess={onSuccess}>
        {({ open }) => (
            <button
                onClick={open}
            >
              Verify with World ID
            </button>
        )}
      </IDKitWidget>
  );
}
