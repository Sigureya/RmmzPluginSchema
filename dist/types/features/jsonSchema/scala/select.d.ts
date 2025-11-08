import { SelectParam } from '../../../rmmz/plugin';
import { JSONSchemaType } from 'ajv';
import { JSONSchemaTypeWithRpgParam } from './base/x-rpg-param';
export declare const compileSelectField: (data: SelectParam) => JSONSchemaType<string>;
export declare const compileSelectFieldWithXparam: (data: SelectParam) => JSONSchemaTypeWithRpgParam<SelectParam>;
