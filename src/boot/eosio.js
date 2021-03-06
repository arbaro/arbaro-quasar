import { openURL, Notify } from "quasar";
import { JsonRpc } from "eosjs";

import { Scatter } from "ual-scatter";
import { Lynx } from "ual-lynx";

import Eos from "ual-quasar-renderer";

const { CHAIN_ID, PROTOCOL, HOST, PORT, CONTRACT } = process.env;

const myChain = {
  chainId: CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: PROTOCOL,
      host: HOST,
      port: PORT
    }
  ]
};

const appName = "Arbaro";
const rpc = new JsonRpc(`${PROTOCOL}://${HOST}:${PORT}`);
const scatter = new Scatter([myChain], { appName });
const lynx = new Lynx([myChain]);

export default ({ Vue }) => {
  Vue.use(Eos, {
    eosStore: new Eos.Store(
      [myChain],
      appName,
      [scatter, lynx],
      Vue,
      Notify,
      openURL
    ),
    extras: {
      defaultContract: CONTRACT
    }
  });

  Vue.prototype.$rpc = rpc;
};
