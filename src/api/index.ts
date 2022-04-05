import { validateDataType } from 'app.d';
import { SchemaType, retrieveSchemaType, setValidateDataType } from './index.d';
import ky from 'ky';

const rootClient = ky.extend({ prefixUrl: '/api' });

/**
 *  api client for schema functonality especially
 */
const schemaClient = ky.extend({
  prefixUrl: '/api/schemas',
});

/**
 * Definiton of schemas we want to get from api
 */
export const schemasToRetrieve: retrieveSchemaType[] = [
  {
    type: SchemaType.entity,
    name: 'services',
  },
  {
    type: SchemaType.entity,
    name: 'routes',
  },
  {
    type: SchemaType.entity,
    name: 'consumers',
  },
  {
    type: SchemaType.plugin,
    name: 'jwt',
  },
  {
    type: SchemaType.plugin,
    name: 'session',
  },
];

/**
 * retrieveSchemaApi: fetch schema data from backapi
 * @params{retrieveSchemaType} - the validation schema we want to fetch
 * @return{Ojbect} - the validation schema we get
 */
const retrieveSchemaApi = (params: retrieveSchemaType) => {
  const { type, name } = params;
  if (type === SchemaType.entity) {
    return schemaClient.get(`${name}`).json();
  }
  if (type === SchemaType.plugin) {
    return schemaClient.get(`plugins/${name}`).json();
  }
};

/**
 * Request schem data for entites and plugins from backend
 * @param{setValidateDataType} - set schema result to data store for rendering
 * @returns{void}
 */
export const getSchemasData = async (setValidateData: setValidateDataType) => {
  const data = (await Promise.all(
    schemasToRetrieve.map(async item => ({
      type: item.type,
      name: item.name,
      data: await retrieveSchemaApi(item),
    })),
  )) as validateDataType[];
  setValidateData(data);
};

/**
 * Test the validation from server-side
 * @param{SchemaType} type - the type of schema: entity or plugin
 * @param{Ojbect} payload - the data you want to validate
 * @returns{Object} - the result from server-side valdation
 */
export const validateSchema = async (
  type: SchemaType,
  payload: { name: string; value: any },
) => {
  const { name, value } = payload;
  if (type === SchemaType.entity) {
    return await schemaClient
      .post(`${name}/validate`, {
        json: value,
      })
      .json();
  }

  if (type === SchemaType.plugin) {
    return await schemaClient
      .post('plugins/validate', {
        json: value,
      })
      .json();
  }
};

/**
 * Create object with different schema data: entity or plugin
 * @param{SchemaType} type - the  type of schema: entity or plugin
 * @param{object} payload - the data you want to use to create the entity or plugin
 */
export const createObject = async (
  type: SchemaType,
  payload: { name: string; value: any },
) => {
  const { name, value } = payload;
  if (type === SchemaType.entity) {
    return await rootClient
      .post(`${name}`, {
        json: value,
      })
      .json();
  }
  if (type === SchemaType.plugin) {
    return await rootClient
      .post('plugins', {
        json: value,
      })
      .json();
  }
};

/**
 * Get referenced data for entry from backend
 * @param{string} reference - which data you want reference: services, routes, consumers, etc..
 * @param{Function} callback - send reference data back to caller
 */
export const getReferenceData = async (
  reference: string,
  callback: (data: any) => void,
) => {
  try {
    const { data = [] }: { data: any[] } = await rootClient
      .get(`${reference}`)
      .json();
    callback(data);
  } catch (e: any) {
    console.log(`Get reference data error: ${e.message}`);
  }
};
