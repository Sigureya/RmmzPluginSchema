using System.Text.RegularExpressions;
namespace RpgTypes{

    public sealed class ParsedPlugin
    {
        public string Locale { get; set; } = "";

        public List<PluginParamToken> Params { get; } = [];

        public List<PluginCommandToken> Commands { get; } = [];

        public List<PluginStructToken> Structs { get; } = [];

        public List<string> HelpLines { get; } = [];

        public PluginMeta Meta { get; set; } = new();

        public PluginDependencies Dependencies { get; set; } = new();
    }

    public sealed class PluginParamAttribute
    {
        public string? Kind { get; set; }

        public string? Struct { get; set; }

        public string? Text { get; set; }

        public string? Desc { get; set; }

        public string? Default { get; set; }

        public string? Min { get; set; }

        public string? Max { get; set; }

        public string? Parent { get; set; }

        public string? On { get; set; }

        public string? Off { get; set; }

        public string? Dir { get; set; }

        public string? Decimals { get; set; }
    }
    public readonly struct PluginDependencies
    {
        public List<string> Base { get; } = [];

        public List<string> OrderBefore { get; } = [];

        public List<string> OrderAfter { get; } = [];
    }
    public sealed class PluginStructToken
    {
        public required string Name { get; init; }

        public List<PluginParamToken> Params { get; } = [];
    }
    public sealed class PluginCommandToken
    {
        public required string Command { get; init; }

        public string? Text { get; set; }

        public string? Desc { get; set; }

        public List<PluginParamToken> Args { get; } = [];
    }

    public sealed class PluginParamToken
    {
        public required string Name { get; init; }

        public PluginParamAttribute Attr { get; } = new();

        public List<OptionItem> Options { get; } = [];
    }
    public sealed class OptionItem
    {
        public required string Option { get; init; }

        public required string Value { get; init; }
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

            return new ParsedPlugin
            {
                Locale = body.Locale,
                Params = _state.Params,
                Commands = _state.Commands,
                HelpLines = _state.HelpLines,
                Meta = _state.Meta,
                Dependencies = _state.Dependencies
            };
        }

        private void ParseLine(string line)
        {
            string trimmed = Regex.Replace(
                line.TrimEnd(),
                @"^[\*\s]*",
                ""
            );

            if (!trimmed.StartsWith("@"))
            {
                if (_state.CurrentContext == "help")
                {
                    _state.HelpLines.Add(trimmed);
                }
                return;
            }

            Match match = Regex.Match(trimmed, @"^@(\S+)\s*(.*)$");

            if (!match.Success)
                return;

            string tag = match.Groups[1].Value;
            string value = match.Groups[2].Value.Trim();

            if (_handlers.TryGetValue(tag, out var handler))
            {
                handler(value);
            }
        }
        private void HandleParam(string name)
        {
            FlushCurrentItem();

            if (_state.Params.Any(x => x.Name == name))
                return;

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
                return;

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
            if (_state.CurrentParam == null){return;}

            if (value.StartsWith("struct<"))
            {
                bool array = value.EndsWith(">[]");

                string structName =
                    array
                        ? value.Substring(7, value.Length - 10)
                        : value.Substring(7, value.Length - 8);

                _state.CurrentParam.Attr.Struct = structName;
                _state.CurrentParam.Attr.Kind = array
                    ? "struct[]"
                    : "struct";

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

            // if (_state.CurrentCommand != null)
            // {
            //     _state.CurrentCommand.Desc = value;
            // }
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
                {       return;}

            setter(_state.CurrentParam.Attr);
        }
        private void FlushCommand()
        {
            if (_state.CurrentCommand == null)
                return;

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
            {    return;}

            _state.Params.Add(_state.CurrentParam);

            _state.CurrentParam = null;
            _state.CurrentContext = null;
        }
    }
}