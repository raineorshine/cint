# History

## 6.0.0
* Removed I. Use _.identity.
* Removed compose. Use _.compose.
* Removed sequence. Use _.compose.apply(args.reverse())).
* Renamed curryAt to partialAt to more closely match lodash semantics.
* Removed curry and rcurry. Use _.partial and _.partialRight.
* Removed currify. Use _.curry.