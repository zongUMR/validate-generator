import react, { useMemo } from 'react';
import { Form } from 'antd';
import { NamePath } from 'antd/lib/form/interface';

import StringFormIterm from '../StringFormItem';
import GroupFormItem, { GroupFormItemSchemaType } from '../GroupFormItem';
import BooleanFormItem from '../BooleanFormItem';
import IntegerFormItem from '../IntegerFormItem';
import ForeignFormItem from '../ForeignFormItem';
import { FormItemWrapperProps, BasicFormItemSchemaType } from './index.d';
import {
  setPropName,
  getValueFromEventAction,
  generateItemExtraInfo,
} from './utils';
import generateRule from './generateRule';

const { Item } = Form;

/**
 * According to different types of schema, return different input component
 * @param{BasicFormItemSchemaType} schema - the type of schema rule
 * @param{NamePath} name - the name of form field: single field or field array
 **/
const renderType = ({
  schema,
  name,
}: {
  schema: BasicFormItemSchemaType;
  name: NamePath;
}) => {
  const { type } = schema;
  if (type === 'integer') {
    return IntegerFormItem({ schema });
  }

  if (type === 'number') {
    return IntegerFormItem({ schema });
  }

  if (type === 'string') {
    return StringFormIterm({ schema });
  }

  if (type === 'foreign') {
    return ForeignFormItem({ reference: schema.reference });
  }

  if (type === 'set' || type === 'array') {
    return GroupFormItem({ schema: schema as GroupFormItemSchemaType });
  }

  if (type === 'boolean') {
    return BooleanFormItem({});
  }

  // A record type indicates it's a nested schema data
  if (type === 'record') {
    const formItemGroups: react.ReactElement[] = [];
    schema.fields.forEach((field: { [key: string]: any }) => {
      const keys = Object.keys(field);
      keys.forEach(key => {
        const newSchema = field[key] as BasicFormItemSchemaType;
        const newName = Array.isArray(name) ? [...name, key] : [name, key]; // concat key to result a new form item name

        const extraInfo = (() => {
          const messages = generateItemExtraInfo(newSchema);
          if (messages === undefined || messages.length === 0) return undefined;
          return messages.map(message => <div key={message}>{message}</div>);
        })();

        formItemGroups.push(
          <Item
            key={key}
            name={newName}
            getValueFromEvent={getValueFromEventAction(newSchema.type)}
            extra={extraInfo}
            initialValue={
              newSchema.default !== undefined ? newSchema.default : null
            }
            label={key}
            valuePropName={setPropName(newSchema.type)}
            rules={generateRule(newSchema)}
          >
            {renderType({
              schema: newSchema,
              name: newName,
            })}
          </Item>,
        );
      });
    });

    return formItemGroups;
  }

  return (
    <div>
      does not support type: <b>{type}</b>
    </div>
  );
};

/**
 * Return a wrapperd FormItem by fields
 * @param{BasicFormItemSchemaType} schema - the rule of each schema
 * @param{string} name - the name of form item field
 **/
const FormItemWrapper: react.FC<FormItemWrapperProps> = ({ schema, name }) => {
  // generate extra info for FormItem via schema
  const extraInfo = useMemo(() => {
    const messages = generateItemExtraInfo(schema);
    if (messages === undefined || messages.length === 0) return undefined;
    return messages.map(message => <div key={message}>{message}</div>);
  }, [schema, generateItemExtraInfo]);

  return (
    <div>
      <Item
        name={name}
        initialValue={schema.default !== undefined ? schema.default : null}
        getValueFromEvent={getValueFromEventAction(schema.type)}
        extra={extraInfo}
        label={name}
        valuePropName={setPropName(schema.type)}
        rules={generateRule(schema)}
      >
        {renderType({ schema, name })}
      </Item>
    </div>
  );
};

export default FormItemWrapper;
