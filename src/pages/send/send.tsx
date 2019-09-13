import { get } from "lodash";
import * as React from "react";
import { FormRenderProps } from "react-final-form";
import { RouterProps } from "react-router";
import { dummy, reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { Props, SendView } from "./sendView";
import { convertAmountToStr, convertAmountFromStr, convertOxgMax, convertOnyxToBigNumber } from "../../utils/number";

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  walletEncoded: state.wallet.wallet,
  tokens: state.settings.tokens,
  tokensBalance: state.runtime.tokenAmounts
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, reduxProps => {
    const tokenOptions = reduxProps.tokens.map(token => ({
      text: token.symbol,
      value: token.symbol
    }));
    const nativeOptions = [
      {
        text: "ONYX",
        value: "ONYX"
      },
      {
        text: "OXG",
        value: "OXG"
      }
    ];
    const ong = convertOxgMax(reduxProps.ongAmount, 0.01);
    const ont = convertOnyxToBigNumber(reduxProps.ontAmount);
    const search = props.history.location.search;
    const params = new URLSearchParams(search);
    const recipientLocation = params.get('recipient') || '';
    const amountLocation = params.get('amount') || null;

    return withProps(
      {
        assetOptions: [...nativeOptions, ...tokenOptions],
        handleCancel: () => {
          props.history.goBack();
        },
        handleConfirm: async (values: object) => {
          console.log(values);
          const recipient = get(values, "recipient", "");
          const asset = get(values, "asset", "");
          const amountStr = get(values, "amount", "0");
          const amount = convertAmountFromStr(amountStr, asset);
          props.history.push("/sendConfirm", { recipient, asset, amount });
        },
        handleMax: (formProps: FormRenderProps) => {
          const asset: string = get(formProps.values, "asset");
          const tokenDecimals = reduxProps.tokens.find(t => t.symbol === asset);
          const tokenBalance = reduxProps.tokensBalance.find(t => t.symbol === asset);

          if (asset === "ONYX") {
            const amountBN = convertAmountToStr(reduxProps.ontAmount, "ONYX");
            formProps.form.change("amount", amountBN.toString());
          } else if (asset === "OXG") {
            const amountBN = convertOxgMax(reduxProps.ongAmount, 0.01);
            formProps.form.change("amount", amountBN.toString());
          } else {
            const amountBN = convertAmountToStr(
              tokenBalance && Number(tokenBalance.amount),
              asset,
              tokenDecimals && tokenDecimals.decimals
            );
            formProps.form.change("amount", amountBN.toString());
          }
          return true;
        }
      },
      injectedProps => (
        <Component
          {...injectedProps}
          ontAmount={ont}
          ongAmount={ong}
          recipient={recipientLocation}
          amount={amountLocation}
        />
      )
    );
  });

export const Send = enhancer(SendView);
