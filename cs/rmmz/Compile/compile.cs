
// public static class FF{
//     public static PluginParam CompilePluginParam(
//         PluginParamTokens tokens,
//         DeepJsonParserHandlers handlers,
//         AttrMessage? message = null)
//     {
//         message ??= AttrMappingTable;

//         if (tokens.Attr.Kind is { } kind &&
//             TABLE.TryGetValue(kind, out var func))
//         {
//             return func(tokens, handlers, message);
//         }

//         return new PluginParam
//         {
//             Name = tokens.Name,
//             Attr = CompileScalarAttributes(
//                 "any",
//                 "",
//                 tokens.Attr,
//                 STRING)
//         };
//     }
// }