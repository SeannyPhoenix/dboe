# The Database of Everything

DBOE is a concept project that evolved as I began to record and relate information about my life and the world that I encountered.

## Thesis

As a species, humanity has created many ways of measuring, categorizing, and relating information over time. In the computer age, this information is stored in data structures.

### Case Study: `Person`

A very popular data example used in teaching programming is `Person`. Following is a simple representation of a student in Go:

```go
type Person struct {
	Name     string
  Birthday time.Time
  Email    string
}
```

Immediately we can see a compression of data. Take the `name` field for example. If `name` is a simple `string`, we lose information such as first, middle, and last names. So let's make a `Name` struct:

```go
type Name struct {
  First  string
  Middle string
  Last   string
}
```

But most people don't actually go by their full name. In fact, many people have nicknames.

```go
type Name struct {
  ...
  RegularName string
  Nickname    string
}
```

But that only covers one culture of names. What about a Japanese name?

```go
type JapaneseName struct {
  Family string
  Given  string
}
```

As you can see, defining such strong types limits real-world representation

### Modeling the Real World

I propose a new model, one without rigid objects. Instead of creating a type with known fields, we can create a simple entity with related tags and values.

This breaks up our original `Person` type into individual values. Each value has a type, and is linked to the individual `Person` to which they apply.

In these diagrams: circles are base types, diamonds are custom types/tags, rectangles are values, and stadium shapes are entities.

```mermaid
graph LR
  TS((string))
  TD((ISO-8601 Date))

  TP{PersonType}
  TP --> P
  P([Entity: Mikey])

  TS --> FN
  FN{FirstName}
  FN --> FNV
  FNV[Michael]
  FNV --> P

  TS --> MN
  MN{MiddleName}
  MN --> MNV
  MNV[Andrew]
  MNV --> P

  TS --> LN
  LN{LastName}
  LN --> LNV
  LNV[Potter]
  LNV --> P

  TS --> NN
  NN{Nickname}
  NN --> NNV
  NNV[Mikey]
  NNV --> P

  TS --> RN
  RN{RegularName}
  RN --> RNV
  RNV[Mikey Potter]
  RNV --> P

  TD --> BD
  BD{Birthday}
  BDV[1988-05-23]
  BD --> BDV
  BDV --> P
```

Thus, the moment there is information of a new type for an entity, it can be clearly created and linked to that entity. Richer data can also be associated, such as a heart-rate reading:

```mermaid
graph LR
  P([Entity: Mikey])

  TK{ReadingType}
  TK --> HRRE
  HRRE([Entity: Heart Rate Reading @ 3PM])
  HRRE --> P

  TI((Integer))
  TI --> THR
  THR{HeartRate}
  THR --> HRV
  HRV[87]
  HRV --> HRRE

  TD((ISO-8601 Date))
  TD --> HRT
  HRT{ReadingTime}
  HRT --> HRTV
  HRTV[2026-07-07T03:00:00Z]
  HRTV --> HRRE
```

The same pattern can model an address while preserving both combined and decomposed values:

```mermaid
graph LR
  P([Entity: Mikey])

  TK{AddressType}
  TK --> AE
  AE([Entity: Address #1])
  AE --> P

  TS((string))
  TI((Integer))

  TS --> SA
  SA{StreetAddress}
  SA --> SAV
  SAV[62 Birchwood Ln]
  SAV --> AE

  TS --> SN
  SN{StreetNumber}
  SN --> SNV
  SNV[62]
  SNV --> AE

  TS --> STN
  STN{StreetName}
  STN --> STNV
  STNV[Birchwood Ln]
  STNV --> AE

  TI --> AP
  AP{ApartmentNumber}
  AP --> APV
  APV[23]
  APV --> AE

  TS --> C
  C{City}
  C --> CV
  CV[Maple Glen]
  CV --> AE

  TS --> S
  S{State}
  S --> SV
  SV[PA]
  SV --> AE

  TS --> PC
  PC{PostalCode}
  PC --> PCV
  PCV[19002]
  PCV --> AE
```

There is no restriction of record types that can be linked together. In this one example, we have seen links from type `PersonType`, value `Potter`, and entity `Heart Rate Reading @ 3PM` to entity `Mikey`.

This free association is much more representitive of the world as we experience it.

Let's explore more complex relationships. Take Mikey's immediate family, for example:

```mermaid
graph LR
  B([Entity: Ben Potter])
  A([Entity: Amy Potter])
  M([Entity: Mikey Potter])
  E([Entity: Emily Potter])
  J([Entity: Jose Silva])

  B -->|FatherOf| M
  B -->|FatherOf| E
  A -->|MotherOf| M
  A -->|MotherOf| E
  M -->|HusbandOf| J
```

Here we see the graph start to emerge, along with more questions. How should directional relationships be represented? In this particular representation, there are directed links from parent to child. There is no implication of any relationship of child to parent.

Should there be a sibling link? If so, does it have a direction? What if we can apply links to links?

The following graph illustrates directional labled edges:

```mermaid
graph LR
  B([Entity: Ben Potter])
  A([Entity: Amy Potter])
  M([Entity: Mikey Potter])
  E([Entity: Emily Potter])

  C1((ChildOf))
  C2((ChildOf))
  C3((ChildOf))
  C4((ChildOf))

  M -.-> C1 -.-> B
  M -.-> C2 -.-> A
  E -.-> C3 -.-> B
  E -.-> C4 -.-> A

  M1((MotherOf))
  M2((MotherOf))
  F1((FatherOf))
  F2((FatherOf))

  B -.-> F1 -.-> M
  B -.-> F2 -.-> E
  A -.-> M1 -.-> M
  A -.-> M2 -.-> E
```

This graph shows linked entities rather than linked links.

```mermaid
graph LR
  B([Entity: Ben Potter])
  A([Entity: Amy Potter])
  M([Entity: Mikey Potter])
  E([Entity: Emily Potter])

  Mo{Mother}
  Fa{Father}
  Da{Daughter}
  So{Son}

  BF([Ben Father])
  AM([Amy Mother])
  MS([Mikey Son])
  ED([Emily Daughter])

  B --> BF
  Fa --> BF

  A --> AM
  Mo --> AM

  BF --> M
  BF --> E

  AM --> M
  AM --> E

  M --> MS
  So --> MS

  E --> ED
  Da --> ED

  MS --> B
  MS --> A

  ED --> B
  ED --> A
```

This graph shows another variation for Ben and Mikey, where each individual fact is an entity.

```mermaid
graph LR
  Ben([Entity: Ben Potter])
  Mikey([Entity: Mikey Potter])

  Father{Role: Father}
  Son{Role: Son}
  FatherSon{Relationship: Father and Son}

  BenFather([Fact: Ben as Father])
  Ben --> BenFather
  Father --> BenFather

  MikeySon([Fact: Mikey as Son])
  Mikey --> MikeySon
  Son --> MikeySon

  BenFatherMikeySon([Fact: Ben as Father to Mikey as Son])
  BenFather --> BenFatherMikeySon
  MikeySon --> BenFatherMikeySon
  FatherSon --> BenFatherMikeySon
```
