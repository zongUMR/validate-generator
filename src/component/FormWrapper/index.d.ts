import { validateDataType } from '@/app.d';
import { SchemaType } from '@/api/index.d';

export type TableWrapperProps = validateDataType;

// the type of schema rule
export type validationFieldType =
  | 'integer'
  | 'string'
  | 'set'
  | 'boolean'
  | 'foreign'
  | 'record'
  | 'number'
  | 'array';

// schema rule structure
export type BasicFormItemSchemaType = {
  type: validationFieldType;
  required?: Boolean;
  [key: string]: any;
};

// FormItemWrapper props
export type FormItemWrapperProps = {
  schema: BasicFormItemSchemaType;
  name: string;
  type: SchemaType;
};

/*
 * Response from server-side validation
 */
export type validateErrorProps = {
  message: string;
  code?: number;
  name?: string;
  fields?: any[];
};
