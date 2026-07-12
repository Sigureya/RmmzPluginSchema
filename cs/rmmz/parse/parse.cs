
using System.Text.RegularExpressions;

namespace RmmzPlusinSchema.Rmmz.Parse;

public sealed class ParseState
{
    public List<PluginParamToken> Params { get; } = new();

    public List<PluginCommandToken> Commands { get; } = new();

    public List<PluginStructToken> Structs { get; } = new();

    public List<string> HelpLines { get; } = new();

    public string? CurrentContext;
    public PluginParamToken? CurrentParam;
    public PluginCommandToken? CurrentCommand;
    public OptionsState? CurrentOption;

    public PluginMeta Meta = new();
    public PluginDependencies Dependencies = new();
}

public sealed class OptionsState
{
    public string? CurrentOption;

    public List<OptionItem> Items { get; } = new();
}

public sealed class PluginParser
{
    private readonly ParseState _state = new();

    private readonly Dictionary<string, Action<string>> _handlers;

    public PluginParser()
    {
        _handlers = new Dictionary<string, Action<string>>(StringComparer.Ordinal)
        {
            ["help"] = HandleHelp,
            ["param"] = HandleParam,
            ["command"] = HandleCommand,
            ["arg"] = HandleArg,

            ["text"] = HandleText,
            ["desc"] = HandleDesc,
            ["type"] = HandleType,

            ["base"] = HandleBase,
            ["orderBefore"] = HandleOrderBefore,
            ["orderAfter"] = HandleOrderAfter,
            ["option"] = HandleOption,
            ["value"] = HandleValue,

            ["default"] = v => AddParamField(a => a.Default = v),
            ["min"] = v => AddParamField(a => a.Min = v),
            ["max"] = v => AddParamField(a => a.Max = v),
            ["on"] = v => AddParamField(a => a.On = v),
            ["off"] = v => AddParamField(a => a.Off = v),
            ["dir"] = v => AddParamField(a => a.Dir = v),
            ["parent"] = v => AddParamField(a => a.Parent = v),
            ["decimals"] = v => AddParamField(a => a.Decimals = v),
        };
    }

    public ParsedPlugin Parse(PluginBodyBlock body)
    {
        foreach (var line in body.Lines)
        {
            ParseLine(line);
        }

        FlushCurrentItem();

        var parsed = new ParsedPlugin
        {
            Locale = body.Locale,
            Meta = _state.Meta,
            Dependencies = _state.Dependencies
        };

        parsed.Params.AddRange(_state.Params);
        parsed.Commands.AddRange(_state.Commands);
        parsed.Structs.AddRange(_state.Structs);
        parsed.HelpLines.AddRange(_state.HelpLines);

        return parsed;
    }

    private void ParseLine(string line)
    {
        string trimmed = Regex.Replace(line.TrimEnd(), @"^[\*\s]*", "");

        if (!trimmed.StartsWith("@", StringComparison.Ordinal))
        {
            if (_state.CurrentContext == "help")
            {
                _state.HelpLines.Add(trimmed);
            }
            return;
        }

        Match match = Regex.Match(trimmed, @"^@(\S+)\s*(.*)$");
        if (!match.Success)
        {
            return;
        }

        string tag = match.Groups[1].Value;
        string value = match.Groups[2].Value.Trim();

        if (_handlers.TryGetValue(tag, out var handler))
        {
            handler(value);
        }
    }

    private void HandleHelp(string _)
    {
        _state.CurrentContext = "help";
    }

    private void HandleParam(string name)
    {
        FlushCurrentItem();

        if (_state.Params.Any(x => x.Name == name))
        {
            return;
        }

        _state.CurrentContext = "param";
        _state.CurrentParam = new PluginParamToken
        {
            Name = name
        };
    }

    private void HandleCommand(string name)
    {
        FlushCurrentItem();

        if (_state.Commands.Any(x => x.Command == name))
        {
            return;
        }

        _state.CurrentCommand = new PluginCommandToken
        {
            Command = name
        };
    }

    private void HandleArg(string name)
    {
        if (_state.CurrentCommand == null)
        {
            return;
        }

        if (_state.CurrentParam != null)
        {
            _state.CurrentCommand.Args.Add(_state.CurrentParam);
        }

        _state.CurrentParam = new PluginParamToken
        {
            Name = name
        };

        _state.CurrentContext = "arg";
    }

    private void HandleType(string value)
    {
        if (_state.CurrentParam == null)
        {
            return;
        }

        if (value.StartsWith("struct<", StringComparison.Ordinal))
        {
            bool array = value.EndsWith(">[]", StringComparison.Ordinal);

            string structName =
                array
                    ? value.Substring(7, value.Length - 10)
                    : value.Substring(7, value.Length - 8);

            _state.CurrentParam.Attr.Struct = structName;
            _state.CurrentParam.Attr.Kind = array ? "struct[]" : "struct";
            return;
        }

        _state.CurrentParam.Attr.Kind = value;
    }

    private void HandleText(string value)
    {
        if (_state.CurrentParam != null)
        {
            _state.CurrentParam.Attr.Text ??= value;
            return;
        }

        if (_state.CurrentCommand != null)
        {
            _state.CurrentCommand.Text ??= value;
        }
    }

    private void HandleDesc(string value)
    {
        if (_state.CurrentParam != null)
        {
            _state.CurrentParam.Attr.Desc ??= value;
            return;
        }

        if (_state.CurrentCommand != null)
        {
            _state.CurrentCommand.Desc = value;
        }
    }

    private void FlushCurrentItem()
    {
        FlushOptions();
        FlushCommand();
        FlushParam();
    }

    private void AddParamField(Action<PluginParamAttribute> setter)
    {
        if (_state.CurrentParam == null)
        {
            return;
        }

        setter(_state.CurrentParam.Attr);
    }

    private void FlushCommand()
    {
        if (_state.CurrentCommand == null)
        {
            return;
        }

        if (_state.CurrentParam != null)
        {
            _state.CurrentCommand.Args.Add(_state.CurrentParam);
            _state.CurrentParam = null;
        }

        _state.Commands.Add(_state.CurrentCommand);
        _state.CurrentCommand = null;
        _state.CurrentContext = null;
    }

    private void FlushParam()
    {
        if (_state.CurrentParam == null)
        {
            return;
        }

        _state.Params.Add(_state.CurrentParam);
        _state.CurrentParam = null;
        _state.CurrentContext = null;
    }

    private void HandleBase(string value)
    {
        _state.Dependencies.Base.Add(value);
    }

    private void HandleOrderBefore(string value)
    {
        _state.Dependencies.OrderBefore.Add(value);
    }

    private void HandleOrderAfter(string value)
    {
        _state.Dependencies.OrderAfter.Add(value);
    }

    private void HandleOption(string option)
    {
        if (_state.CurrentParam == null)
        {
            return;
        }

        _state.CurrentOption ??= new OptionsState();

        if (_state.CurrentOption.CurrentOption != null)
        {
            _state.CurrentOption.Items.Add(new OptionItem
            {
                Option = _state.CurrentOption.CurrentOption,
                Value = _state.CurrentOption.CurrentOption
            });
        }

        _state.CurrentOption.CurrentOption = option;
    }

    private void HandleValue(string value)
    {
        if (_state.CurrentOption?.CurrentOption == null)
        {
            return;
        }

        _state.CurrentOption.Items.Add(new OptionItem
        {
            Option = _state.CurrentOption.CurrentOption,
            Value = value
        });

        _state.CurrentOption.CurrentOption = null;
    }

    private void FlushOptions()
    {
        if (_state.CurrentParam == null || _state.CurrentOption == null)
        {
            return;
        }

        if (_state.CurrentOption.CurrentOption != null)
        {
            _state.CurrentOption.Items.Add(new OptionItem
            {
                Option = _state.CurrentOption.CurrentOption,
                Value = _state.CurrentOption.CurrentOption
            });
        }

        if (_state.CurrentParam.Attr.Kind is "select" or "combo")
        {
            _state.CurrentParam.Options.AddRange(_state.CurrentOption.Items);
        }

        _state.CurrentOption = null;
    }
}
