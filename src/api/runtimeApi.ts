import axios from "axios";
import { get } from "lodash";
import { CONST, Crypto, OntAssetTxBuilder, TransactionBuilder } from "ontology-ts-sdk";
import { getWallet } from "./authApi";
import Address = Crypto.Address;
import { getClient } from "../network";
import { getAccount, decryptAccount } from "./accountApi";
import { getOptions } from "../api/constants";

export async function getBalance(walletEncoded: any) {
  const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address;
  const client = getClient();
  const response = await client.getBalance(address);

  const onyx: number = Number(get(response, "Result.onyx"));
  const oxg: number = Number(get(response, "Result.oxg"));

  return {
    onyx,
    oxg
  };
}

/* 
  TODO:
  fix getUnboundong in wsProvider
  use Ws
*/
export async function getUnboundOxg( walletEncoded: any) {
	const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address;
  const unboundOngUrl = `/addresses/${address.toBase58()}/balances`;
  const options = getOptions();
  const endpoint = options.blockExplorer.address;

  const url = endpoint + unboundOngUrl;
  const response = await axios.get(url, { params: { asset_name: 'oxg' } }).then(res => {
    return res.data;
  });

  let unboundOng: any;
  response.result.map(item => {
    if(item.asset_name === "unboundoxg"){
      unboundOng = Number(item.balance);
    }
  })
  return unboundOng;
}

export async function transfer(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any,
  password: string,
  recipient: string,
  asset: "ONYX" | "OXG",
  amount: string
) {
  const wallet = getWallet(walletEncoded);
  const from = getAccount(wallet).address;
  const privateKey = decryptAccount(wallet, password);
  // tslint:disable-next-line:no-console
  console.log("from: ", from);
  const to = new Address(recipient);

  const tx = OntAssetTxBuilder.makeTransferTx(asset, from, to, String(amount), "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  // tslint:disable-next-line:no-console
  console.log("transfer tx", tx);
  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any,
  password: string,
  amount: string
) {
  const wallet = getWallet(walletEncoded);
  const from = getAccount(wallet).address;
  const privateKey = decryptAccount(wallet, password);
  const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, from, String(amount), from, "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);
  console.log("withdrawOng tx", tx);
  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}
