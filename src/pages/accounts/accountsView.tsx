import * as React from "react";
import { Button } from "semantic-ui-react";
import { AccountList, AccountLogoHeader, View, Spacer } from "../../components";

export interface Props {
  loading: boolean;
  accounts: string[];
  selectedAccount: string;

  handleAdd: () => void;
  handleBack: () => void;

  handleExport: () => void;
  handleClear: () => void;

  handleAccountClick: (account: string) => void;
  handleAccountDelClick: (account: string) => void;
}

export const AccountsView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>

    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Accounts" />
      <View content={true} className="spread-around">
        <View>Select the account to switch to or manage your wallet.</View>
      </View>
    </View>

    <View className="list-header"><span>Accounts in my wallet</span></View>

    <View className="list-btns-box">
      <View orientation="column" className="scrollView">
        <AccountList
          accounts={props.accounts}
          selectedAccount={props.selectedAccount}
          onClick={props.handleAccountClick}
          onDel={props.handleAccountDelClick}
        />
      </View>
      <View orientation="column" className="buttons">
        <Button icon="add" content="Add account" onClick={props.handleAdd} loading={props.loading} disabled={props.loading} />
        <Spacer/>
        <Button type="button" onClick={props.handleExport} content="Export wallet" />
        <Spacer />
        <Button type="button" onClick={props.handleClear} content="Clear wallet" icon="delete" />
        <Spacer />
        <Button content="Back" onClick={props.handleBack} disabled={props.loading} />
      </View>
    </View>
  </View>
);
