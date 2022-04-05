import { Rule } from 'antd/lib/form';
import { BasicFormItemSchemaType } from './index.d';

/**
 * Generate form validations for different schemas
 * - schema@property
 *   - one\_of: Must point at one of options
 *   - len\_min: The minimum length for each item
 *   - between: The minimum and maximum range for number
 *   - match\_all: The all items must match all included regrex
 *   - match\_any: The item will be valid as long as it matches any regrex
 *   - match\_none: The all included regrex can't be matched
 *   - uuid: The item must match uuid format {@link:https://en.wikipedia.org/wiki/Universally\_unique\_identifier}
 *   - starts\_with: Each item should start with the field
 *
 * @param{BasicFormItemSchemaType} schema - validation schema detail
 */
const generateRule = (schema: BasicFormItemSchemaType) => {
  const ruleConfig: Rule[] = [];
  if (schema.required) {
    ruleConfig.push({
      required: true,
    });
  }

  switch (schema.type) {
    case 'string':
    case 'foreign': {
      if (schema.one_of) {
        ruleConfig.push({
          type: 'enum',
          enum: schema.one_of,
        });
      }
      if (schema.len_min) {
        ruleConfig.push({
          type: 'string',
          min: schema.len_min,
        });
      }
      break;
    }
    case 'integer':
    case 'number': {
      if (schema.one_of) {
        ruleConfig.push({
          type: 'enum',
          enum: schema.one_of,
        });
      }
      if (schema.between) {
        ruleConfig.push({
          type: 'number',
          min: schema.between[0],
          max: schema.between[1],
        });
      }
      break;
    }
    case 'array':
    case 'set': {
      const validator = (_: any, valItems: string[] | null) => {
        const { elements = {} } = schema;
        if (!valItems?.length) return Promise.resolve();
        if (elements?.match_all) {
          for (const reg of elements.match_all) {
            const res = valItems.every(val =>
              new RegExp(reg.pattern).test(val),
            );
            if (!res) {
              return Promise.reject(new Error(reg.err));
            }
          }
        }

        if (elements?.match_any && elements?.match_any?.patterns) {
          const res = valItems.some(val => {
            const match_any_res = elements.match_any.patterns.some(
              (pattern: string) => new RegExp(pattern).test(val),
            );
            return match_any_res;
          });
          if (!res) {
            return Promise.reject(new Error(elements.match_any?.err));
          }
        }

        if (elements?.starts_with) {
          const startsCheck = valItems.every(val =>
            val.startsWith(elements.starts_with),
          );
          if (!startsCheck) {
            return Promise.reject(
              new Error(`Every item should start with ${elements.starts_with}`),
            );
          }
        }

        if (elements?.match_none) {
          for (const reg of elements.match_none) {
            const res = valItems.some(val => new RegExp(reg.pattern).test(val));
            if (res) {
              return Promise.reject(new Error(reg.err));
            }
          }
        }

        if (elements?.len_min) {
          if (valItems.length < elements.len_min) {
            return Promise.reject(
              new Error(
                `Item can not less than ${elements.len_min}, but only contains ${valItems.length}`,
              ),
            );
          }
        }

        if (elements?.uuid) {
          const uuidReg = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$',
            'i',
          );
          const res = valItems.every(val => uuidReg.test(val));
          if (!res) {
            return Promise.reject(new Error('Contains invalid uuid format'));
          }
        }

        if (elements?.match) {
          const match_res = valItems.every(val =>
            new RegExp(elements.match).test(val),
          );
          if (!match_res) {
            return Promise.reject(
              new Error(`Value must follow regrex: ${elements.match}`),
            );
          }
        }
        return Promise.resolve();
      };

      ruleConfig.push({ validator });
      break;
    }

    default:
  }

  return ruleConfig;
};

export default generateRule;
