# History

## 6.0.0
- Removed I. Use _.identity.
- Removed compose. Use _.compose.
- Removed sequence. Use _.compose.apply(args.reverse())).
- Renamed curryAt to partialAt to more closely match lodash semantics.
- Removed curry and rcurry. Use _.partial and _.partialRight.
- Removed currify. Use _.curry.
- Removed toInstance, install, and installPrototypes. Use [nativity-cint](https://github.com/metaraine/nativity-cint).
- Removed contains. Use _.contains.

## 6.1.0
- Add node-qunit
- Remove 'var' from cint declaration to work with node-qunit