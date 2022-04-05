import { SchemaType } from 'api/index.d';

/**
 * The common schema for entity and plugin:
 * @type{SchemaType}: the type of schema we want to validate
 * @name{string}: the name of validation, `services`, `routes` and etc. Doc: https://docs.konghq.com/gateway/2.8.x/admin-api/#service-object
 * @data{object:{fields:[object]}}: the detail of schema for each validation
 */
export type validateDataType = {
  type: SchemaType;
  name: string;
  data: {
    fields: [{ [key: string]: any }];
  };
};
