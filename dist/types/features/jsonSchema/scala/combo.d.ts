import { ComboParam } from '../../../rmmz/plugin';
import { JSONSchemaType } from 'ajv';
import { JSONSchemaTypeWithRpgParam } from './base/x-rpg-param';
export declare const compileComboField: (data: ComboParam) => JSONSchemaType<string>;
export declare const compileComboFieldWithXparam: (data: ComboParam) => JSONSchemaTypeWithRpgParam<ComboParam>;
