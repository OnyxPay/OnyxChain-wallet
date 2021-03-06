import * as React from "react";
import { Button } from "semantic-ui-react";
import { Transfer } from "../../redux/runtime";
import { LogoHeader, Spacer, View, Filler } from "../../components";
import { TokenAmountList } from "../../components";
import { OEP4TokenAmount } from "src/api/tokenApi";

export interface Props {
  ontAmount: string;
  ongAmount: string;
  tokens: OEP4TokenAmount[];
  unboundAmount: string;
  ownAddress: string;
  transfers: Transfer[] | null;
  handleSend: () => void;
  handleTransfers: () => void;
  handleReceive: () => void;
  handleWithdraw: () => void;
  handleOpenTransfers: () => void;
  handleExchange: () => void;
}

export const DashboardView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Balances" />
    </View>

    <View content={true} className="spread-around balance-container">
      <View orientation="column" className="balance onyx-balance-column">
        <label className="balance-label">ONYX</label>
        <h1 className="onyx-balance-amount">{props.ontAmount}</h1>
      </View>

      <View orientation="column" className="exchange-box">
        <span>Exchange ONYX to OXG</span>
        <Button
          onClick={props.handleExchange}
          size="big"
          compact={true}
          basic={true}
          icon="exchange"
        />
      </View>

      <View orientation="column" className="balance">
        <label className="balance-label">OXG</label>
        <h3>{props.ongAmount}</h3>
        <h4
          onClick={props.handleWithdraw}
          className="unbound"
          data-tooltip="Unbound OXG"
          data-position="bottom center"
        >
          {props.unboundAmount} (Claim)
        </h4>
      </View>
    </View>

    <View orientation="column" fluid={true} content={true} className="spread-around">
      {props.tokens && props.tokens.length ? (
        <View orientation="column" className="tokens-list">
          <TokenAmountList tokens={props.tokens} />
        </View>
      ) : null}

      <Filler />
      <View className="buttons align-items-center" orientation="column">
        <Button icon="send" content="Send" onClick={props.handleSend} />
        <Spacer />
        <Button icon="inbox" content="Receive" onClick={props.handleReceive} />
        <Spacer />
        <Button content="Open Transfers" onClick={props.handleTransfers} />
      </View>
    </View>
  </View>
);
