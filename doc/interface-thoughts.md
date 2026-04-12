# Interface Thoughts

Exploratory design notes on Go interfaces for DBOE's four core definition types: `dboetype`, `unit`, `entity`, and `dimension`. These are the schema layer — they live in code and tell the system how to interpret data.

---

## The Four Types and Their Likely Responsibilities

### DBOEType

The most fundamental building block. Describes what kind of value a dimension holds.

**Likely responsibilities:**
- Provide the JSON Schema for external documentation/tooling
- Marshal a Go value to `json.RawMessage`
- Unmarshal `json.RawMessage` to a Go value
- Validate `json.RawMessage` without fully unmarshaling (useful for quick checks)

**The split problem:** Marshal/unmarshal need a concrete Go type, but dynamic dispatch erases it. This suggests two layers:
- A typed `Codec[T]` for static use (you know the Go type at compile time)
- An `AnyCodec` interface for dynamic use (you're inspecting an arbitrary record)

```go
type AnyCodec interface {
    Schema() json.RawMessage
    Marshal(v any) (json.RawMessage, error)
    Unmarshal(data json.RawMessage) (any, error)
    Validate(data json.RawMessage) error
}

type Codec[T any] struct {
    Def dboetype.Definition
    // implements AnyCodec; also exposes typed methods
}

func (c Codec[T]) UnmarshalTyped(data json.RawMessage) (T, error)
func (c Codec[T]) MarshalTyped(v T) (json.RawMessage, error)
```

`core.String`, `core.BinaryTime`, etc. would be `Codec[string]`, `Codec[binarytime.BinaryTime]`, etc. Each registers itself in a package-level registry keyed by `dboetype.Definition.ID`.

---

### Unit

Represents a measurable standard with a precise ratio to some base. Currently holds a `fixed128.Fixed128` value.

**Likely responsibilities:**
- Provide its ratio value (already stored in `Definition.Value`)
- Convert a quantity expressed in this unit to another unit
- Format a value for display (e.g. "3 days", "1.5 years")

**Conversion** requires knowing both units' ratios. It probably doesn't belong on the `Unit` itself — a free function `Convert(value fixed128.Fixed128, from, to unit.Definition) fixed128.Fixed128` may be cleaner than a method.

**Display** is probably out of scope for now, but worth noting as a future responsibility.

**Interface sketch:**
```go
type Unit interface {
    ID() uuid.UUID
    Namespace() namespace.Namespace
    Value() fixed128.Fixed128  // ratio to base
}
```

This one may not need a rich interface at all — it might be pure data that functions operate on.

---

### Entity

Describes a type of thing that exists in the database (e.g. Person, Organization).

**Likely responsibilities:**
- Create a new record of this entity type (already exists as `NewRecord`)
- Provide its definition metadata (ID, namespace)
- Enumerate its known dimensions (open question — see below)

**The dimensions question:** Should an entity definition know about its dimensions? In the current model, dimensions reference entities (via `Ref`), not the other way around. Reversing that would allow `person.Person.Dimensions()` to return `[Name, Age, BirthDateTime, ...]`. Useful for introspection and tooling, but requires some form of registration.

**Interface sketch:**
```go
type Entity interface {
    ID() uuid.UUID
    Namespace() namespace.Namespace
    NewRecord() entity.Record
}
```

---

### Dimension

Describes a typed attribute that can be attached to an entity via a record. The bridge between `entity` (what the value belongs to) and `dboetype` (what the value is).

**Likely responsibilities:**
- Provide its type (which `dboetype` to use for marshal/unmarshal)
- Provide its unit (optional — for numeric dimensions like Age)
- Create a new record linking a value to an entity
- Unmarshal a dimension record's `Value` field using the correct codec
- Validate a candidate value

This is the type that most needs to expose codec behavior, since it's the practical entry point when reading dimension records.

**Interface sketch:**
```go
type Dimension interface {
    ID() uuid.UUID
    Namespace() namespace.Namespace
    Type() uuid.UUID         // dboetype ID
    Unit() uuid.UUID         // zero if none
    Codec() AnyCodec         // the codec for this dimension's type
}

// Typed variant — what person.Name, person.Age etc. would implement
type TypedDimension[T any] interface {
    Dimension
    Unmarshal(data json.RawMessage) (T, error)
    Marshal(v T) (json.RawMessage, error)
}
```

---

## A Shared Base?

All four types share: `ID() uuid.UUID` and `Namespace() namespace.Namespace`. A base interface is tempting:

```go
type Definition interface {
    ID() uuid.UUID
    Namespace() namespace.Namespace
}
```

But in practice, code rarely needs to hold a heterogeneous slice of definitions. The shared base might not earn its keep. Worth revisiting once there's a concrete use case for it (e.g. a schema export function that iterates all definitions).

---

## The Registry

For dynamic dispatch — reading an arbitrary dimension record and knowing how to unmarshal its value — a registry is needed:

```go
// maps dboetype.Definition.ID → AnyCodec
var codecs = map[uuid.UUID]AnyCodec{}

func RegisterCodec(id uuid.UUID, c AnyCodec) { ... }
func LookupCodec(id uuid.UUID) (AnyCodec, bool) { ... }
```

Each `Codec[T]` registers itself at init time (or via an explicit `Register()` call). The lookup chain for a dimension record is:

```
dimension.Record.Key.Type()         // → dimension definition ID
→ dimension.Definition.Type         // → dboetype ID
→ LookupCodec(dboetypeID)           // → AnyCodec
→ AnyCodec.Unmarshal(record.Value)  // → any
→ type assert                       // → concrete Go value
```

Where the registry lives (its own package, `pkg/core`, or injected) is an open question.

---

## Open Questions

1. **Should `Dimension` hold a reference to its `AnyCodec` directly, or look it up via the registry?** Direct reference is simpler; registry is more flexible if codecs can be swapped or extended.

2. **Should `Entity` know its dimensions?** Requires a registration step (dimensions registering themselves against an entity). Useful for schema introspection but adds coupling.

3. **Where does the registry live?** Options: `pkg/codec` (neutral), `pkg/core` (alongside the core type definitions), or injected as a dependency to avoid global state.

4. **How does `TypedDimension[T]` work with the interface model?** Go generics can't be stored in a `map[uuid.UUID]TypedDimension[T]` without type erasure. The `AnyCodec` layer handles dynamic dispatch; the typed layer is for compile-time use only.

5. **Unit conversion:** free function or method? If it's a method, which type owns it?
