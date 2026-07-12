
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace PluginParser.Compiler;

public static partial class PluginParamCompiler
{
    /// <summary>
    /// TypeScriptの attrString
    /// </summary>
    public static string AttrString(string value)
    {
        return value;
    }

    /// <summary>
    /// "[1,2,3]" → int[]
    /// </summary>
    public static IReadOnlyList<int> NumberArray(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return [];
        }

        return value
            .Trim()
            .TrimStart('[')
            .TrimEnd(']')
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim().Trim('"'))
            .Select(x =>
            {
                if (int.TryParse(
                    x,
                    NumberStyles.Integer,
                    CultureInfo.InvariantCulture,
                    out var result))
                {
                    return (true, result);
                }

                if (double.TryParse(
                    x,
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out var d))
                {
                    return (true, (int)d);
                }

                return (false, 0);
            })
            .Where(x => x.Item1)
            .Select(x => x.Item2)
            .ToArray();
    }

    /// <summary>
    /// エラーが存在する場合のみ返す
    /// </summary>
    public static IReadOnlyList<ParamError>? NormalizeErrors(
        IReadOnlyList<ParamError> errors)
    {
        return errors.Count == 0
            ? null
            : errors;
    }

    /// <summary>
    /// optionをコピーする
    /// </summary>
    public static OptionItem CloneOption(OptionItem item)
    {
        return new OptionItem
        {
            Option = item.Option,
            Value = item.Value
        };
    }

public static readonly IReadOnlyDictionary<string, AttributeParser>
    NUMBER = new Dictionary<string, AttributeParser>
{
    ["default"] = value =>
        float.Parse(value, CultureInfo.InvariantCulture),

    ["text"] = AttrString,

    ["desc"] = AttrString,

    ["parent"] = AttrString,

    ["min"] = value =>
        float.Parse(value, CultureInfo.InvariantCulture),

    ["max"] = value =>
        float.Parse(value, CultureInfo.InvariantCulture),

    ["decimals"] = value =>
        int.Parse(value, CultureInfo.InvariantCulture),
};

public static readonly IReadOnlyDictionary<string, AttributeParser>
    BOOLEAN = new Dictionary<string, AttributeParser>
{
    ["default"] = value => value == "true",

    ["text"] = AttrString,

    ["desc"] = AttrString,

    ["parent"] = AttrString,

    ["on"] = AttrString,

    ["off"] = AttrString,
};

public static readonly IReadOnlyDictionary<string, AttributeParser>
    FILE = new Dictionary<string, AttributeParser>
{
    ["default"] = AttrString,

    ["text"] = AttrString,

    ["desc"] = AttrString,

    ["parent"] = AttrString,

    ["dir"] = AttrString,
};

public static readonly IReadOnlyDictionary<string, AttributeParser>
    STRUCT = new Dictionary<string, AttributeParser>
{
    ["text"] = AttrString,

    ["desc"] = AttrString,

    ["parent"] = AttrString,
};
}