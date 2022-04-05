import { Input, Checkbox, Row, Col } from 'antd';
import react from 'react';
import { BasicFormItemSchemaType } from '../FormWrapper/index.d';

export type GroupFormItemSchemaType = BasicFormItemSchemaType & {
  elements: {
    type: string;
    required?: boolean;
    [key: string]: any;
  };
};

const GroupFormItem: react.FC<{ schema: GroupFormItemSchemaType }> = ({
  schema,
}) => {
  const {
    elements: { type, one_of },
  } = schema;

  if (one_of) {
    return (
      <Checkbox.Group>
        <Row>
          {one_of.map((item: string) => (
            <Col key={item} span={8}>
              <Checkbox value={item}>
                <div style={{ minWidth: 100 }}>{item}</div>
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    );
  }
  if (type === 'string') {
    return <Input placeholder="以','分割: text1, text2" />;
  }
  return null;
};

export default GroupFormItem;
