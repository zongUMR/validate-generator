import { Switch, Form } from 'antd';
import FormItemWrapper from './FormItemWrapper';
import { SchemaType } from '@/api/index.d';

/**
 * Return some extra and special form items under different conditions
 * @param{SchemaType}: the type of schema
 * 1. Plugin type, we need to return [enable, services reference, rotues reference] items
 * @returns{React.ReactNode}
 **/
const ExtraFormItems = ({ type }: { type: SchemaType }) => {
  if (type === SchemaType.plugin) {
    return (
      <>
        <Form.Item
          name="enabled"
          label="开启插件"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        <FormItemWrapper
          name={'service'}
          type={SchemaType.plugin}
          schema={{
            type: 'foreign',
            reference: 'services',
          }}
        />
        <FormItemWrapper
          name={'route'}
          type={SchemaType.plugin}
          schema={{
            type: 'foreign',
            reference: 'routes',
          }}
        />
      </>
    );
  }
  return null;
};

export default ExtraFormItems;
