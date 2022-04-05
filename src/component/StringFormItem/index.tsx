import { Input, Radio } from "antd";
import react from "react";

import { BasicFormItemSchemaType } from "../FormWrapper/index.d";

type FormItemSchemaType = BasicFormItemSchemaType & {
    one_of?: string[];
};
const StringFormIterm: react.FC<{ schema: FormItemSchemaType }> = ({
    schema,
}) => {
    if (schema.one_of) {
        return (
            <Radio.Group>
                {schema.one_of.map((item) => (
                    <Radio key={item} value={item}>
                        {item}
                    </Radio>
                ))}
            </Radio.Group>
        );
    }

    return <Input />;
};

export default StringFormIterm;
