import { get } from "lodash";
import * as React from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { Filler, LogoHeader, Spacer, View } from "../../components";
import { range, required, testBase58Address } from "../../utils/validate";

export interface AssetOption {
  text: string;
  value: string;
}
export interface Props {
  ontAmount: number;
  ongAmount: number;
  recipient: string;
  amount: string | null;
  assetOptions: AssetOption[];
  handleConfirm: (values: object) => Promise<void>;
  handleMax: (formProps: FormRenderProps) => void;
  handleCancel: () => void;
}

/**
 * todo: amount number step does not work for OXG, should be changed to custom validation
 */
export const SendView: React.SFC<Props> = props => {
  const {recipient} = props;
  const {amount} = props;

  return (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Send" />
      <View content={true} className="spread-around">
        <View>Double check the address of the recipient.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        onSubmit={props.handleConfirm}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View orientation="column">
              <label>Recipient</label>
              <Field
                name="recipient"
                validate={recipient ? () => testBase58Address(recipient) : testBase58Address}
                render={t => { 
                  return (
                    <>
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={recipient ? t.input.value = recipient : t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                      />
                      {t.meta.touched && t.meta.invalid && t.input.value && (
                        <div className="field-error">{t.meta.error}</div>
                      )}
                    </>
                  );
                }}
              />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Asset</label>
              <Field
                name="asset"
                validate={recipient ? () => required("ONYX") : required}
                render={t => (
                  <SemanticForm.Dropdown
                    fluid={true}
                    selection={true}
                    options={props.assetOptions}
                    onChange={(e, data) => t.input.onChange(data.value)}
                    value={recipient ? t.input.value = "ONYX" : t.input.value}
                    error={t.meta.touched && t.meta.invalid}

                  />
                )}
              />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Amount</label>
              <Field
                name="amount"
                value={amount}
                validate={amount ? range(0,  props.ontAmount) : range(
                  0,
                  get(formProps.values, "asset") === "OXG" ? props.ongAmount : props.ontAmount
                )}
                render={t => {
                  console.log(t);
                  return (
                  <SemanticForm.Input
                    type="number"
                    placeholder={
                      get(formProps.values, "asset") === "OXG"
                        ? "0.000000000"
                        : get(formProps.values, "asset") === "ONYX"
                        ? "0.00000000"
                        : "0"
                    }
                    step={
                      get(formProps.values, "asset") === "OXG"
                        ? "0.000000001"
                        : get(formProps.values, "asset") === "ONYX"
                        ? "0.00000001"
                        : "1"
                    }
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: amount ? t.input.value = amount : t.input.value  }}
                    error={t.meta.touched && t.meta.invalid}
                    action={
                      <Button
                        type="button"
                        className="maxBtn"
                        onClick={() => props.handleMax(formProps)}
                        content="MAX"
                      />
                    }
                  />
                  )}
                }
              />
            </View>
            <Filler />
            <View className="buttons">
              <Button onClick={props.handleCancel}>Cancel</Button>
              <Button icon="check" type="submit" content="Confirm" />
            </View>
          </SemanticForm>
        )}
      />
    </View>
  </View>
)};
