# ENRE-ts

ENRE-ts is an entity relationship extractor for ECMAScript and TypeScript.

## Entity Categories

### Node.js

| Entity Name                  | Definition                                                                                                                                               |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Package](entity/package.md) | A `Package Entity` is a Node.js package, which usually contains a `package.json` file to indicate this, and its name can be used as an import specifier. |

### ECMAScript

| Entity Name                      | Definition                                                                                                                       |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| [File](entity/file.md)           | A `File Entity` is mostly a JavaScript source file, and can also be something relevant to the project.                           |
| [Variable](entity/variable.md)   | A `Variable Entity` is a variable defined by keywords `let`/`const`/`var`.                                                       |
| [Function](entity/function.md)   | A `Function Entity` is either a block of code defined with keyword `function` or an arrow function `() => {}`.                   |
| [Parameter](entity/parameter.md) | A `Parameter Entity` is a variable defined either as function's formal parameter or in a `catch` clause.                         |
| [Class](entity/class.md)         | A `Class Entity` is a template of object containing properties and methods defined by keyword `class`.                           |
| [Field](entity/field.md)         | A `Field Entity` is a public / private 'variable' defined inside a `Class Entity`.                                               |
| [Method](entity/method.md)       | A `Method Entity` is a 'function' or function-like thing (getter / setter) defined inside a `Class Entity` or an object literal. |
| [Property](entity/property.md)   | A `Property Entity` can be many things, including a key-value pair in an object, or a TypeScript subtype.                        |
| [Alias](entity/alias.md)         | An `Alias Entity` is an alias for an exported/imported symbol.                                                                   |

### TypeScript

| Entity Name                                | Definition                                                                                                                   |
|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| [Namespace](entity/namespace.md)           | A `Namespace Entity` is a named container for types providing a hierarchical mechanism for organizing code and declarations. |
| [Type Alias](entity/type-alias.md)         | A `Type Alias Entity` is a convenient alias for a compound type.                                                             |
| [Enum](entity/enum.md)                     | An `Enum Entity` is a set of named constants for document intent, or create a set of distinct cases.                         |
| [Enum Member](entity/enum-member.md)       | An `Enum Member Entity` is a member defined inside an enum body.                                                             |
| [Interface](entity/interface.md)           | An `Interface Entity` is a name and parameterized representation of an object type and can be implemented by classes.        |
| [Type Parameter](entity/type-parameter.md) | A `Type Parameter Entity` is a placeholder for an actual type.                                                               |

### Misc

| Scoping Element Name     | Definition                                                            |
|--------------------------|-----------------------------------------------------------------------|
| [Block](entity/block.md) | Any declaration space spanned by `{}` and is a non-functional entity. |

## Relation Categories

### ECMAScript

| Relation Name                    | Definition                                                                                                                                                                                |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Import](relation/import.md)     | An `Import Relation` establishes a link between a `File Entity` and any other kinds of entity that the latter one is imported for use.                                                    |
| [Export](relation/export.md)     | An `Export Relation` establishes a link between a `Package Entity` or `File Entity` and any other kinds of entity that the latter one is exported so that other files can import and use. |
| [AliasOf](relation/aliasof.md)   | An `AliasOf Relation` establishes a link between an `Alias Entity` and any other export-able entities that given the original symbol an alias.                                            |
| [Call](relation/call.md)         | A `Call Relation` establishes a link between an upper entity and a `Function Entity` or `Method Entity` that the latter one is called within the former one's scope.                      |
| [Set](relation/set.md)           | A `Set Relation` establishes a link between an upper entity and any other named value entities which appear on the left side of assignment expressions.                                   |
| [Use](relation/use.md)           | A `Use Relation` establishes a link between an upper entity and any other entities that appear on its scope for real purpose.                                                             |
| [Modify](relation/modify.md)     | A `Modify Relation` establishes a link between an upper entity and any other named value entities which appear on both sides of assignment expressions or unary operators.                |
| [Extend](relation/extend.md)     | An `Extend Relation` establishes a link between `Class Entity`s and `Interface Entity`s that enables hierarchical reusing , or setups a restriction on `Type Parameter Entity`..          |
| [Override](relation/override.md) | An `Override Relation` establishes a link between two `Method Entity`s that a subclass one overrides a superclass one.                                                                    |
| [Decorate](relation/decorate.md) | A `Decorate Relation` establishes a link between two entities that one decorate the other. (Currently a stage 3 proposal)                                                                 |

### TypeScript

| Relation Name                      | Definition                                                                                                                                                |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Type](relation/type.md)           | A `Type Relation` establishes a link between a value entity that accepts `TypeAnnotation` and any other type entities which appear on the typing context. |
| [Implement](relation/implement.md) | An `Implement Relation` establishes a constraint (type checking) on `Class Entity` according to `Interface Entity`'s declarations.                        |

## References

1. [ECMAScript Specification](https://tc39.es/ecma262/2022), 13th
   edition, (June) 2022
2. [TypeScript Specification](https://github.com/microsoft/TypeScript/blob/main/doc/spec-ARCHIVED.md)
   , Version 1.8, January 2016
3. [JSX Specification](https://facebook.github.io/jsx/#sec-intro)
   , August 4, 2022
4. [Node.js Documentation](https://nodejs.org/dist/latest-v16.x/docs/api/)
   , v16.14.2 LTS, April 2021
