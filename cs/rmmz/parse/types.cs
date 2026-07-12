namespace RmmzPlusinSchema.Rmmz.Parse;
public sealed class ParsedPlugin
{
    public string Locale { get; set; } = "";

    public List<PluginParamToken> Params { get; } =  new();

    public List<PluginCommandToken> Commands { get; } = new();

    public List<PluginStructToken> Structs { get; } =  new();

    public List<string> HelpLines { get; } = new();

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
public class PluginDependencies
{
    public List<string> Base { get; } =  new();

    public List<string> OrderBefore { get; } =  new();

    public List<string> OrderAfter { get; } =  new();
}
public sealed class PluginStructToken
{
    public required string Name { get; init; }

    public List<PluginParamToken> Params { get; } =  new();
}
public sealed class PluginCommandToken
{
    public required string Command { get; init; }

    public string? Text { get; set; }

    public string? Desc { get; set; }

    public List<PluginParamToken> Args { get; } =  new();
}

public sealed class PluginParamToken
{
    public required string Name { get; init; }

    public PluginParamAttribute Attr { get; } = new();

    public List<OptionItem> Options { get; } =  new();
}
public sealed class OptionItem
{
    public required string Option { get; init; }

    public required string Value { get; init; }
}
public sealed class PluginMeta
{
    public string? Author { get; set; }

    public string? PluginDescription { get; set; }

    public string? Url { get; set; }
}


public sealed class PluginBodyBlock
{
    public string Locale { get; init; } = "";

    public List<string> Lines { get; } = new();
}
