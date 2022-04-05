import { validateDataType } from 'app.d';

/**
 * The type of schema we want to validate for
 * @entity - entity validation
 * @plugin - plugin validation
 */
export enum SchemaType {
    entity = 'entity',
    plugin = 'plugin',
}

/**
 * The structure of data to retrieve a validation schema
 * @type{SchemaType} - the type of schema
 * @name - the name of entity or plugin to get
 **/
export type retrieveSchemaType = {
    type: SchemaType;
    name: string;
};

/**
 * Set validation schema data
 * @data{validateDataType[]}: the array of validation schema data fetch from api
 */
export type setValidateDataType = (data: validateDataType[]) => void;
