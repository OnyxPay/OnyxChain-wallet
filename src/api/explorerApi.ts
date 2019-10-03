import axios from "axios";
import { flatMap, get } from "lodash";
import { AssetType, Transfer, AmountType } from "../redux/runtime";
import { decodeAmount } from "src/utils/number";
import { getOptions } from "../api/constants";

export async function getTransferList(address: string) {
  const options = getOptions();
  const endpoint = options.blockExplorer.address;

  const url = `${endpoint}/addresses/${address}/transactions`;

  const response = await axios.get(url, { params: { page_size: '20', page_number:'1'} });
  const txnList: any[] = get(response, "data.result", []);

  return flatMap(
    txnList.map(tx => {
      const txnTime: number = get(tx, "tx_time", 0);
      const transferList: any[] = get(tx, "transfers", []);

      return transferList.map(transfer => {
        return {
          amount: translateAmount((get(transfer, "amount")), (get(transfer, "asset_name"))),
          asset: translateAsset(get(transfer, "asset_name")),
          from: get(transfer, "from_address"),
          time: txnTime,
          to: get(transfer, "to_address")
        } as Transfer;
      });
    })
  );
}

function translateAmount(amount: any, asset: any): AmountType  {
  if (asset === "onyx") {
    return decodeAmount(amount, 8);
  } else if (asset === "oxg") {
    return decodeAmount(amount, 0);
  } 
}

function translateAsset(asset: any): AssetType {
  if (asset === "onyx") {
    return "ONYX";
  } else if (asset === "oxg") {
    return "OXG";
  } else {
    return "ONYX";
  }
}
