# DBOE Web UI Architecture & Design Philosophy

**Conversation Date:** 2026-08-14  
**Topic:** Initial exploration of UI design direction, backend model understanding, and architecture definition

---

## Overview

This conversation established the philosophical foundation and architectural blueprint for DBOE's web interface. The work bridges two critical perspectives: **design vision** (how the system should feel and support cognition) and **backend reality** (how data is actually stored, mutated, and indexed).

The central thesis: **a graph-native knowledge substrate requires a multi-lens, timeline-aware UI that treats the interface as a transparent optical instrument, not as an application shell.**

---

## Part 1: Design Comparison & Divergence Analysis

### Starting Point: Two Dark-Mode Examples

We examined two existing CSS designs in the codebase:

- **example-a.css** — polished, product-like dark interface
- **example-b.css** — utilitarian, data-heavy interface

#### Shared Patterns (Both Examples)

1. **Dark-first contrast strategy**  
   Light text over dark surfaces; muted borders reduce hierarchy noise. Both treat dark mode as a legibility tool, not a novelty.

2. **Tokenized styling**  
   Root-level CSS variables (colors, fonts, spacing) enable theme consistency and future tweaks without file-wide edits.

3. **Form-control normalization**  
   Explicit borders, backgrounds, and focus states on inputs/buttons/selects prevent browser defaults from clashing with dark UI.

4. **Layout primitives over one-off hacks**  
   Modern grid/flex, spacing systems, reusable utility-oriented classes ensure consistency and reduce visual debt.

5. **Interaction clarity**  
   Hover, focus, and active states exist in both; controls remain usable and discoverable in low-light palettes.

#### Divergences (Philosophy & Execution)

| Aspect           | Example A                                             | Example B                                                   | Implication                                                      |
| ---------------- | ----------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Visual Tone      | Curated, polished product                             | System-native, practical data tool                          | Product A targets end-user appeal; B targets technical precision |
| Typography       | Modern UI sans (Avenir Next, Segoe UI)                | Custom mono (B612 Mono) + semantic system colors            | A is humanist; B is technical/systematic                         |
| Architecture     | Card + form centric                                   | Route/schedule/table centric                                | A assumes general workflows; B assumes dense data browsing       |
| CSS Style        | Plain CSS, straightforward selectors                  | Nested selectors, :has() combinator, advanced relationships | A is simple to maintain; B is semantically rich but complex      |
| Color Philosophy | Explicit role tokens (bg, surface, ink, accent, warn) | Semantic system colors (Field, Canvas) plus custom accents  | A is author-driven; B delegates to OS/theme                      |
| Motion & Depth   | Radial gradients, shadows, atmosphere                 | Flat, functional, emphasis on legibility                    | A prioritizes visual depth; B prioritizes data clarity           |

### Design Lesson

Neither approach is universally "better." **Example A excels at communicating through visual polish; Example B excels at encoding density and system semantics.** For DBOE's graph UI, neither example should be directly copied. Instead, we should derive a third aesthetic that:

1. Avoids visual drama competing with data structure
2. Makes type information and relationship patterns first-class
3. Uses spatial and color grammar consistently to encode meaning
4. Supports multidimensional navigation without overwhelming the user
5. Treats dark mode as an accessibility and focus tool, not as a design theme

---

## Part 2: Product Vision & Thesis

### The Core Insight

> "Literally every part of the site will be connected to the graph. There's no material difference between editing my settings or adding an event to a calendar or writing a journal or keeping track of my wardrobe."

This statement rejects the traditional app architecture pattern of separate features, domain models, and data silos. Instead, it proposes:

**One graph. Many lenses. Zero silos.**

### What This Unlocks

1. **Universal Composability**  
   A journal entry, calendar event, clothing item, and preference are all just typed entities with relationships, constraints, and history. They share the same data model and mutation semantics.

2. **Cross-Domain Queries Become Natural**  
   Find journal entries written on days with low sleep and formal meetings, then suggest wardrobe choices that matched good outcomes. This query spans traditionally separate domains without introducing a "search" or "reporting" module.

3. **Shared Infrastructure for Everything**  
   Validation, permissions, versioning, tagging, search, and automation all work once across all domains. No reimplementation per feature.

4. **Rich Provenance**  
   Every field can answer: where did it come from? What changed? Why? What depends on it?

5. **Dynamic Schema Evolution**  
   Since types live in the graph, users can extend the system without waiting for hardcoded feature work. The graph describes itself.

### Design Principles for This Vision

1. **UI should never expose app boundaries, only graph boundaries**  
   Users navigate identity (what this entity is), type (what rules define it), relations (what it connects to), behavior (what actions are valid), and history (what changed and what depends on it).

2. **Visual hierarchy encodes meaning, not branding**
   - Highest contrast: node identity
   - Secondary contrast: node type
   - Medium contrast: relationship edge labels
   - Muted tier: metadata, system hints
   - Distinct but low-emphasis: empty/unknown states

3. **Build multidimensional navigation, not a single "main" view**
   - Primary graph canvas for topology
   - Adjacent structured inspector for detail
   - Breadcrumb + query trail for traversal history
   - Type lens toggle for schema exploration
   - Relationship lens toggle for cardinality/impact analysis

4. **Make self-description continuously available**  
   Every node chip includes type marker. Every edge label can expand to relation definition. Inspector shows instance fields and type fields side-by-side. Hovering type names highlights all same-typed nodes in current scope.

5. **Use spatial grammar consistently for relationships**
   - Directional arrows and edge label anchoring are predictable
   - Relationship cardinality has stable visual encoding
   - Sticky focus: selected node stays central while neighborhood reorganizes
   - Progressive reveal: 1-hop default, then expand to 2-hop and beyond

6. **Dark-mode palette strategy for dense graph work**  
   Avoid trendy neon. Use restrained luminance steps:
   - Page background: very dark, low saturation
   - Surface layers: small elevation steps for panel separation
   - Text tiers: clear 3-level system (primary, secondary, muted)
   - Accent color: one semantic accent for active selection
   - Status colors: sparse and functional only (warning/error/success)
   - Focus ring: high visibility, accessible, consistent

7. **Typography for dense graph tooling**
   - Primary UI font: highly legible sans with generous x-height
   - Secondary mono usage: only for identifiers, IDs, compact key-value blocks
   - Tight control of line length in inspectors
   - Tabular numerals for counts/metrics

8. **Interaction principles that fit graph cognition**
   - Hover previews should be informative, not decorative
   - Selection state must be unmistakable
   - Keyboard traversal should mirror graph traversal
   - Expand/collapse controls always indicate resulting scope
   - Undo navigation should be trivial and visible

### Important Guardrails

1. **Prevent ontology drift**  
   Need naming conventions, type templates, and migration helpers so the graph doesn't become inconsistent over time.

2. **Keep traversal cognitively bounded**  
   Use scoped neighborhoods, saved views, and path breadcrumbs to avoid overwhelming users with the full graph.

3. **Make permissions graph-aware**  
   Access control should apply to edges and fields, not just top-level entities.

4. **Treat time as first-class**  
   Bitemporal or versioned edges will matter when everything is interconnected and mutable.

---

## Part 3: Backend Model Understanding

### Core Architecture (Go Backend)

The backend is built on **record-log graph semantics**, not traditional relational or object models.

#### Record Types (4 primitives)

1. **Entity** — a node with no intrinsic data; identity is given by UUID and type
2. **Value** — opaque byte-payload linked to an entity by type; schema meaning is externalized into graph relationships
3. **Link** — a directed edge between two entities; semantics come from type information
4. **Tombstone** — a deletion marker with same UUID as deleted record, newer timestamp; implements append-only mutation

#### Core Operations

1. **Create**  
   `NewEntity()`, `NewValue([]byte)`, `NewLink(uuid, uuid)` each generate unique UUID and current timestamp.

2. **Update**  
   `UpdateValue(record, newData)` generates new Value record with same entity UUID, fresh timestamp. Overwrites on load via last-write-wins.

3. **Delete**  
   `DeleteRecord(record)` generates Tombstone with same UUID, fresh timestamp. Server deletes via LWW.

4. **Read**  
   `GetRecordByID(uuid)` retrieves latest record (by timestamp) for that ID. `GetLinksFrom(uuid)` uses adjacency index for fast neighborhood traversal.

#### Storage & Indexing

1. **Binary append-only file**  
   [FileHeader][Record][Record]... where each record is marshaled with type + ID + timestamp + optional payload.  
   Writes happen via append; reads scan full file.

2. **In-memory RecordIndex** (keyed by UUID)  
   On startup, `LoadDatabase()` scans file, groups records by ID, keeps only the latest per ID (by timestamp). Tombstones suppress live state.

3. **In-memory LinkIndex** (nested map UUID → set<UUID>)  
   Adjacency index derived from live Link records. Updated on record add/delete. Fast neighborhood queries.

4. **Server API**
   - `GET /api/dump` — dump full RecordIndex as JSON
   - `GET /api/records/{recordID}` — fetch single record by ID
   - `POST /api/records` — append one or more records to both file and in-memory state

#### Mutation Semantics

- All mutations are **append-only** — updates and deletes are new records, not in-place edits
- **Conflict resolution via timestamp** — if two clients add records with same UUID, the one with newer timestamp wins on server load
- **Eventual consistency** — clients load full DB on connect, then poll or subscribe for deltas; no real-time streaming yet
- **No constraints enforcement** — validation logic is responsibility of client and consuming application

### Why This Matters for the UI

1. **Complete temporal audit trail** — every record has ID + timestamp; can reconstruct graph state at any point in time
2. **No transaction isolation** — single append-only log means all records see the same causal history
3. **Self-describing schema** — type information is stored as entities/values/links in the graph, not hardcoded in application
4. **Flexible evolution** — new record types can be defined at runtime without schema migrations

---

## Part 4: UI Architecture

### Architectural Layers

#### Layer 1: Core Data Model (Client-Side)

Mirror the backend in TypeScript:

```typescript
type RecordType = 'entity' | 'value' | 'link' | 'tombstone';

interface Record {
  t: RecordType;
  id: string; // UUID
  ts: Date; // binarytime.Date
  v?: Uint8Array; // payload for value records
  l?: { a: string; b: string }; // UUIDs for link records
}

interface RecordIndex {
  [id: string]: Record;
}

interface LinkIndex {
  [fromId: string]: Set<string>; // set of target UUIDs
}

interface Viewport {
  seed: string; // active entity UUID
  depth: number; // hop count
  nodes: Set<string>; // entity UUIDs in current view
  edges: Array<{ a: string; b: string; type: string }>;
}

interface AppState {
  graph: RecordIndex & LinkIndex;
  viewport: Viewport;
  activeEntity: string;
  activeLens: LensType;
  mutationQueue: Record[];
  history: string[]; // traversal stack
}
```

**Data source:** `/api/dump` on startup, then delta-sync via POST responses.

#### Layer 2: View/Lens System

A **lens** is a projection over the same immutable graph data, switching rendering, affordances, and navigation without changing the underlying model.

##### Entity Lens

- **Purpose:** inspect a single node
- **Shows:** type badge, all incoming/outgoing links, all value records linked to entity
- **Affordances:** add value, create link, expand neighborhood

##### Type Lens

- **Purpose:** filter/group by type
- **Shows:** all entities of a type, shared value names, relationship patterns
- **Affordances:** bulk operations, type constraints, schema inspection

##### Relationship Lens

- **Purpose:** inspect an edge class
- **Shows:** all link records of a pattern (e.g., all "ParentOf" links), cardinality, impact
- **Affordances:** navigate source/target, edit link metadata

##### Timeline Lens

- **Purpose:** sorted by record timestamp
- **Shows:** mutation log per entity or global, diff previews
- **Affordances:** revert (issue tombstone), inspect causality

##### Query Lens (future)

- **Purpose:** custom traversal results
- **Shows:** results of graph pattern queries
- **Affordances:** save lens, compose with other views

**Key insight:** All lenses read the same `RecordIndex`. They differ only in sort, filter, grouping, and interaction layout.

#### Layer 3: Component Primitives

##### RecordChip

- Compact entity/value/link rendering
- Displays type badge + primary label
- On-hover: full metadata preview
- On-click: navigate to detail pane

##### NeighborhoodView

- Renders local graph with depth control
- Nodes are RecordChips
- Edges show link type + cardinality
- Sticky focus: selected node stays central while neighborhood updates
- Toggle buttons to expand/collapse depth tiers

##### Inspector Panel

- Side/split-pane detail view
- Tabs: instance values, relationships, type definition, history
- Type definition shows all value slots expected for this entity type
- Instance tab shows actual values linked to entity
- Relationships tab shows inbound/outbound links by type

##### MutationForm

- Context-aware CRUD form
- For new value: type selector, value input, link to parent
- For new link: source selector, target selector, link type selector
- For update: show old/new diffs, affected downstream entities, undo path
- For delete: show tombstone impact, orphaned edges, confirm scope

##### TypeBadge

- Persistent visual marker: glyph + short name
- Colored per type category
- Clickable to filter by type
- Always present on entities, values, links

##### Breadcrumb Trail

- Shows: entity → link → entity → link → …
- Clickable to backtrack
- Persists across lens switches

#### Layer 4: State Management

Single source of truth in `AppState`:

- **graph:** full loaded data (RecordIndex + LinkIndex)
- **viewport:** scoped rendering bounds
- **activeEntity:** currently focused node
- **activeLens:** current view mode
- **mutationQueue:** pending changes awaiting confirm
- **history:** traversal stack

**State transitions:**

- On navigation: update `activeEntity` and `history`, viewport re-renders neighbors
- On mutation: add to `mutationQueue`, show preview, await confirm → POST to `/api/records`
- On confirm: optimistically update local `RecordIndex`, sync server response

#### Layer 5: Data Flow

**Startup:**

- GET `/api/dump` → hydrate `RecordIndex` + `LinkIndex`
- Render default lens (entity detail view of first root)

**Navigate (click entity chip):**

- Mutation queue clears (implicit discard or save)
- Update `activeEntity`, expand `viewport`, re-render

**Mutate (add record):**

- Open MutationForm for type (entity/value/link)
- Form generates preview: `Record` + impact analysis
- On confirm: POST to `/api/records`, await 201
- On response: merge new record into `RecordIndex`, update dependent views

**Lens switch:**

- Data unchanged; only rendering changes
- Breadcrumb + activeEntity persist
- Viewport re-projects for new lens

**Type inspection:**

- Hover TypeBadge → show type entity definition
- Click TypeBadge → filter viewport to show only that type
- Toggle "Schema view" → show type entity + all linked type-constraint entities

#### Layer 6: Safety & Undo

**Impact preview before commit:**

- Analyze graph: if deleting entity with high out-degree, show affected neighbors
- If updating a value used in computations, highlight dependents
- If creating a link that violates cardinality, warn

**Tombstone semantics:**

- Delete posts `Record { type: "tombstone", id: <original>, ts: now }`
- UI optimistically hides old record, renders tombstone marker
- Server ensures LWW conflict resolution

**Undo via history:**

- Breadcrumb trail allows backtrack without server trip
- Mutation queue discards on navigation
- No persistent undo log (yet) — can add via type system later

---

## Part 5: Concrete Example — Journal Entry Workflow

1. User clicks "New Entity" → creates blank entity
2. Selects type "JournalEntry" → shows MutationForm with value slots: title, body, date
3. Fills form, clicks preview → shows:
   - New entity UUID
   - New value records (title, body, date linked to entity)
   - Auto-link to calendar on date
   - Affected calendar date node highlights
4. Confirms → POST array of records → server responds with created IDs + timestamps
5. UI updates, navigates to new entry detail in Entity Lens
6. Related calendar event now shows back-link to entry

---

## Part 6: Why This Architecture Scales

- **No hardcoded domains** — journal/wardrobe/settings all use same components + lenses
- **Self-describing** — type information comes from graph, not config
- **Dense data friendly** — lenses and depth control prevent hairball
- **Safe mutations** — preview + impact analysis before commit
- **Temporal-aware** — breadcrumb + history + mutations preserve navigation context
- **Extensible** — new lenses plug in without touching data model

---

## Part 7: Future Directions

### Query Language

Add `/api/query` endpoint accepting traversal specification. Define QueryLens with pattern input: "all entities of type X linked to type Y where Z". Render results in same NeighborhoodView, grouped by result type. Save query as lens (store as entity in graph).

### Real-Time Sync

Replace polling with WebSocket subscription to record changes. Broadcast mutations to all connected clients. Implement operational transformation or CRDT for conflict resolution.

### Permissions & Access Control

Make ACLs graph-aware: store access rules as entities/values/links. Check permissions per edge traversal, not just per entity.

### Computation & Constraints

Define types with constraints (cardinality, field validation, computed fields). Store as type entities + constraint entities. Evaluate on client before POST.

### Offline-First

Use local IndexedDB to cache full graph. Optimize mutations queue for eventual sync. Show local-only state while server unavailable.

---

## Part 8: Key Takeaways

1. **DBOE's UI is not an app; it is an optical instrument**  
   The interface is a transparent viewport onto one immutable append-only log. Every feature is a lens projection over the same data.

2. **Graph cognition requires multidimensional navigation**  
   Single views (like traditional CRUD UIs) fail for connected data. Lenses, breadcrumbs, type filters, and history are non-negotiable.

3. **Self-description must be inline, not behind menus**  
   Type information, constraints, and relationships should be visible immediately on every entity.

4. **Dark mode is a tool for focus, not a theme**  
   Restrained luminance, semantic color roles, and consistent spatial grammar support reading dense graph structures.

5. **Safety before speed**  
   Impact previews, mutation confirmations, and temporal audit trails enable users to make bold changes with confidence.

6. **The backend model implies the UI model**  
   Record types, append-only semantics, and LWW conflict resolution directly shape state management, mutation flow, and undo behavior.

---

## Next Steps

1. **File structure:** Define TypeScript module layout (data model, lenses, components, state)
2. **Component implementation:** Start with RecordChip, Breadcrumb, TypeBadge as foundational pieces
3. **State management:** Choose or build state library (Redux, MobX, custom) aligned with append-only semantics
4. **API client:** Implement /api/dump, /api/records, polling/streaming logic
5. **CSS system:** Build token set aligned with design principles (typography, color, spacing, depth)
6. **Entity Lens:** First full lens; demonstrates state flow and component integration
7. **Type Lens:** Second lens; shows filtering, grouping, bulk operations
