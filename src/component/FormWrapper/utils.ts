import { SchemaType } from '@/api/index.d';
import { BasicFormItemSchemaType, validationFieldType } from './index.d';
import update from 'immutability-helper';

/**
 * Decide which fields need to validate for entities and plugins
 */
const validationArrow: {
  [key: string]: {
    [key: string]: string[];
  };
} = {
  [SchemaType.entity]: {
    services: [
      'name',
      'retries',
      'protocol',
      'host',
      'port',
      'path',
      'connect_timeout',
      'write_timeout',
      'read_timeout',
      'tags',
      'client_certificate',
      'tls_verify_depth',
      'ca_certificates',
      'enabled',
      'url',
    ],
    routes: [
      'name',
      'protocols',
      'methods',
      'hosts',
      'paths',
      'https_redirect_status_code',
      'regex_priority',
      'strip_path',
      'path_handling',
      'preserve_host',
      'request_buffering',
      'response_buffering',
      'tags',
      'service',
    ],
    consumers: ['username', 'custom_id', 'tags'],
  },

  [SchemaType.plugin]: {
    jwt: ['config'],
    session: ['config'],
  },
};

/**
 * Get valid fields to validate
 * @param{SchemaType} type - the type of schema
 * @param{string} name - the name of entity or plugin to get
 * @returns{string[]} - valid validation fields
 */
export const getValidationArrow = (type: SchemaType, name: string) => {
  if (validationArrow[type]?.[name]) {
    return validationArrow[type][name];
  }
  return [];
};

/*
 * Convert data that server-side can accept before valdiate online or submit to backend
 * @param{SchemaType} type - the type of schema
 * @param{string} name - the name of entity or plugin
 * @param{object} formValue - the value of validation form
 * @returns{object} - formatted data
 */
export const convertData = (type: SchemaType, name: string, formValue: any) => {
  let res: { [key: string]: any } = formValue;

  // for plugin schema, it should have a default field - name which is the name of plugin
  if (type === SchemaType.plugin) {
    res = update(res, { name: { $set: name } });
  }

  // for foreign type of schema rule, if it has value, it should be a object with id property, otherwise it's just null value
  const foreignKey = ['client_certificate', 'route', 'service', 'consumer'];
  foreignKey.forEach(key => {
    if (res.hasOwnProperty(key)) {
      if (res[key]) {
        res = update(res, { [key]: { $set: { id: res[key] } } });
      } else {
        res = update(res, { [key]: { $set: null } });
      }
    }
  });

  return res;
};

/**
 * A boolean FormItem's valuePropName is "checked":{@link:https://ant.design/components/form/#Form.Item}
 */
export const setPropName = (type: validationFieldType) => {
  if (type === 'boolean') {
    return 'checked';
  }
  return 'value';
};

/**
 * Format FormItem field value via the type of schema rule
 */
export const getValueFromEventAction = (type: validationFieldType) => {
  // if the type of schema rule is "array" or "rule", field should be formatted as array when it's controled by a Input component automatically
  if (type === 'array' || type === 'set') {
    const func = (e: any) => {
      if (Array.isArray(e)) return e;
      return e.target.value
        .split(',')
        .filter((item: string) => !!item)
        .map((item: string) => item.trim());
    };
    return func;
  }

  return undefined;
};

/**
 * Generate extra help info for FormItem via shcema rules
 * FormItem.extra: {@link: https://ant.design/components/form/#Form.Item.extra}
 *
 * @param{BasicFormItemSchemaType}: schema rule of entity or plugin
 */
export const generateItemExtraInfo = (
  schema: BasicFormItemSchemaType,
): string[] | undefined => {
  if (schema.type === 'record') return undefined;

  let messages: string[] = [];

  switch (schema.type) {
    case 'string':
    case 'foreign': {
      if (schema.len_min) {
        let message = `每个元素长度不小于 ${schema.len_min}`;
        if (schema.one_of) {
          message = `至少有${schema.len_min}元素`;
        }
        messages.push(message);
      }
      break;
    }
    case 'integer':
    case 'number': {
      if (schema.between) {
        messages.push(`${schema.between[0]}到${schema.between[1]}之间`);
      }
      break;
    }
    case 'array':
    case 'set': {
      const { elements = {} } = schema;

      if (elements.match_all) {
        let res = [];
        for (const reg of elements.match_all) {
          res.push(reg.pattern);
        }
        messages.push(`所有元素需要符合下列所有正则表达式: ${res.join(', ')}`);
      }

      if (elements.match_any && elements.match_any.patterns) {
        let res = [];
        for (const pattern of elements.match_any.patterns) res.push(pattern);

        messages.push(`所有元素需要符合下列任一正则表达式: ${res.join(', ')}`);
      }

      if (elements.starts_with) {
        messages.push(`所有元素以 ${elements.starts_with} 开头`);
      }

      if (elements.match_none) {
        let res = [];
        for (const reg of elements.match_none) res.push(reg.pattern);
        messages.push(`所有元素不能符合下列任意正则表达式: ${res.join(', ')}`);
      }

      if (elements.len_min) {
        messages.push(`每个元素长度不小于 ${elements.len_min}`);
      }

      if (elements.uuid) {
        messages.push(`所有元素都要符合UUID格式`);
      }
      break;
    }
    default:
  }

  return messages;
};
