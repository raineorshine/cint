# History

## 6.0.0
- Removed compose, contains, filter, find, group, isEmpty, merged, pluck, range. Use underscore functions of the same name.
- Removed I. Use _.identity.
- Removed findByProperty. Use _.findWhere.
- Removed filterBy. Use _.where.
- Removed hasKey. Use _.has.
- Removed sequence. Use _.compose.apply(args.reverse())).
- Renamed curryAt to partialAt to more closely match lodash semantics.
- Removed curry and rcurry. Use _.partial and _.partialRight.
- Removed currify. Use _.curry.
- Removed toInstance, install, and installPrototypes. Use [nativity-cint](https://github.com/metaraine/nativity-cint).
- Removed reversed. Use arr.concat().reverse().
- Renamed hasValue to isValue

- Removed distributions. Use git tags to checkout a specific version.

## 6.1.0
- Add node-qunit
- Remove 'var' from cint declaration to work with node-qunit
