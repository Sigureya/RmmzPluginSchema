import type {
  Actor,
  Armor,
  ComboAnnotation,
  MultilineString,
  StringArg,
  Class,
  CommonEvent,
  Item,
  NumberArg,
  NumberSelect,
  Skill,
  State,
  Switch,
  Troop,
  Weapon,
} from "./primitive";
export declare const ANNOTATION_STRING: StringArg;
export declare const ANNOTATION_MULTILINE_STRING: MultilineString;
export declare const ANNOTATION_NUMBER: NumberArg;
export declare const ANNOTATION_ACTOR: Actor;
export declare const ANNOTATION_SWITCH: Switch;
export declare const ANNOTATION_ARMOR: Armor;
export declare const ANNOTATION_SKILL: Skill;
export declare const ANNOTATION_ITEM: Item;
export declare const ANNOTATION_WEAPON: Weapon;
export declare const ANNOTATION_TROOP: Troop;
export declare const ANNOTATION_CLASS: Class;
export declare const ANNOTATION_STATE: State;
export declare const ANNOTATION_COMMON_EVENT: CommonEvent;
export declare const ANNOTATION_COMBO: ComboAnnotation;
export declare const ANNOTATION_SELECT_NUMBER: NumberSelect;
export declare const ANNOTATION_TABLE_STRING: {
  readonly string: StringArg;
  readonly combo: ComboAnnotation;
  readonly multiline_string: MultilineString;
};
