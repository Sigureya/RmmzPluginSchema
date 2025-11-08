import { StringParam } from '../../../rmmz/plugin';
import { JSONSchemaType } from 'ajv';
import { JSONSchemaTypeWithRpgParam } from './base/x-rpg-param';
export declare const compileStringField: (data: StringParam) => JSONSchemaType<string>;
export declare const compileStringFieldWithXparam: (data: StringParam) => JSONSchemaTypeWithRpgParam<StringParam>;
