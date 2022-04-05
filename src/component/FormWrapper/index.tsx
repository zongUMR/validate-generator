import * as react from 'react';
import { Form, Button, Switch, message } from 'antd';

import { validateSchema, createObject } from '@/api';
import { TableWrapperProps, validateErrorProps } from './index.d';
import FormItemWrapper from './FormItemWrapper';
import RenderErrorInfo from './RenderErrorInfo';
import ExtraFormItems from './ExtraFormItems';
import { getValidationArrow, convertData } from './utils';

import './index.css';

const FormWrapper: react.FC<TableWrapperProps> = ({ data, name, type }) => {
  const [form] = Form.useForm();

  // Validate payload from server-side before submit data
  const [validateOnline, setValidateOnline] = react.useState<boolean>(true);
  const [reqRes, setResponse] = react.useState<validateErrorProps>({
    message: '',
  });

  const onFinish = react.useCallback(
    async value => {
      const formValue = convertData(type, name, value);
      try {
        if (validateOnline) {
          await validateSchema(type, {
            value: formValue,
            name,
          });
        }
        await createObject(type, { name, value: formValue });
        message.success(`新建 ${name} 成功`);
        form.resetFields();
        setResponse({ message: '' });
      } catch (e: any) {
        const res = await e.response.json();
        setResponse(res);
      }
    },
    [type, name, validateOnline, reqRes],
  );

  const validtatonFields = getValidationArrow(type, name); // the fields we want to validate

  return (
    <div className="tableWrapper">
      <div className="validateOnline">
        <b>Validate form online before submit: </b>
        <Switch
          defaultChecked={validateOnline}
          onChange={v => {
            if (!v) {
              setResponse({ message: '' });
            }
            setValidateOnline(v);
          }}
        />
      </div>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 14 }}
        name={name}
        form={form}
        onFinish={onFinish}
      >
        <ExtraFormItems type={type} />

        {data.fields.map(field => {
          const keys = Object.keys(field).filter(key =>
            validtatonFields.includes(key),
          );
          return keys.map(key => (
            <FormItemWrapper
              key={key}
              name={key}
              schema={field[key]}
              type={type}
            />
          ));
        })}

        <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>
      <RenderErrorInfo validateError={reqRes} />
    </div>
  );
};

export default FormWrapper;
