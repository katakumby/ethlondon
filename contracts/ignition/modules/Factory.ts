import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ONE_GWEI: bigint = 1_000_000_000n;
const FactoryModule = buildModule("FactoryModule", (m) => {
  // const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  //
  const lock = m.contract("FactoryGroup", [], {
    value: lockedAmount,
  });

  return { lock };
});

export default FactoryModule;
