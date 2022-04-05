import react from "react";
import { InputNumber, Radio } from "antd";
import { BasicFormItemSchemaType } from "../FormWrapper/index.d";

export type IntegerFormItemProps = BasicFormItemSchemaType & {
    one_of?: number[];
    bewteen?: number[];
};

const IntegerFormItem: react.FC<{ schema: IntegerFormItemProps }> = ({
    schema,
}) => {
    if (schema.one_of) {
        return (
            <Radio.Group>
                {schema.one_of.map((item) => (
                    <Radio.Button key={item} value={item}>
                        {item}
                    </Radio.Button>
                ))}
            </Radio.Group>
        );
    }

    return (
        <InputNumber
            style={{ width: 300 }}
            min={schema.bewteen && schema.bewteen[0]}
            max={schema.bewteen && schema.bewteen[1]}
        />
    );
};

export default IntegerFormItem;
