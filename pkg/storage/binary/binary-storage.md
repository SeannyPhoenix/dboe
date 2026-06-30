# DBOE Binary Storage

The Database of Everything (DBOE) exists as a stream of logged records. These records can be stored as JSON for simple reading, writing, and transmitting. However, DBOE is very expansive. In order to reduce the size of the stored data, DBOE records can be stored in a binary format.

A DBOE binary document starts with a header, followed by records.

## Conventions

All data is stored in big-endian byte order.

## Document Header

| Version | UUID                                   |
| ------- | -------------------------------------- |
| 0.1.0   | `e910b229-ff0a-447e-9c25-79c98051f4f8` |

The first iteration of the document header is the literal sequence `dboe`, followed by a 128-bit UUID indicating the encoding version. This takes 20 bytes.

#### Header for latest version (0.1.0)

```
 d  b  o  e  e9 10 b2 29-ff 0a-44 7e-9c 25-79 c9 80 51 f4 f8

 64 62 6f 65 e9 10 b2 29 ff 0a 44 7e 9c 25 79 c9 80 51 f4 f8
```

## Record

Each record is composed of a header and type-dependent data.

### Record Header

Each record has a header with three parts:

- The first byte of the record header is a type flag
- The second part is the 16-byte UUID
- The third part is the 16-byte timestamp

The size of the header is 33 bytes.

#### Type Flag

The first byte of the header is a pre-defined 8-bit record-type flag. There are currently 4 record types, as defined in the following table:

| Name                           | Flag Value | Binary      |
| ------------------------------ | ---------- | ----------- |
| _Unused_                       | 0          | `0000 0000` |
| [Entity](#entity-record)       | 1          | `0000 0001` |
| [Value](#value-record)         | 2          | `0000 0010` |
| [Link](#link-record)           | 3          | `0000 0011` |
| [Tombstone](#tombstone-record) | 4          | `0000 0100` |

#### UUID ID

The next 16 bytes are the ID as a 128-bit UUID.

#### Timestamp

The final 16 bytes are the 128-bit timestamp in [Binary Time](https://github.com/seannyphoenix/binarytime).

#### Header Byte Layout

```
+ Type Flag (1 byte)
|
| + UUID (16 bytes)
| |
| |                + Timestamp (16 bytes)
| |                |
- ---------------- --------------
```

### Entity Record

An Entity Record has no additional fields, so the length of an binary-encoded Entity is 33 bytes.

#### Entity Byte Layout

See [Header Byte Layout](#header-byte-layout).

### Value Record

A Value Record also has a data field. This field has its own header, the length of the content, stored in a 32-bit unsigned integer. The record size is 33 + 4 + N bytes, where N is the length of the content.

> The 32-bit length header allows for ~4.29 GB of data per record. In practice, it will be much lower, and 256 MB is a recommended cap.

> The data is stored as raw binary with no defined type. The serialization details are left to the consumer.

#### Value Byte Layout

```
 + Header (33 bytes)
 |
 |  | + Size (4 bytes)
 |  |
 |  |     + Content (N bytes)
 |  |     |
[-] ---- [-]
```

### Link Record

A Link Record has two additional fields, the `a` UUID and the `b` UUID. Since these are both 128-bit values, they are simply appended to the record. The record size is 33 + 32 = 65 bytes.

#### Link Byte Layout

```
 + Header (33 bytes)
 |
 |  + `a` UUID (16 bytes)
 |  |
 |  |                + `b` UUID (16 bytes)
 |  |                |
[-] ---------------- ----------------
```

### Tombstone Record

A Tombstone Record has no additional fields, so the length of a binary-encoded Tombstone is 33 bytes.

#### Tombstone Byte Layout

See [Header Byte Layout](#header-byte-layout).

## Examples

### Simple Encoding with several records

#### JSONL

The JSON Lines storage format is 401 bytes.

```jsonl
{"t":1,"id":"2044d9f9-0bcd-46b2-91ea-a3da8de613ec","ts":"@000004000000509a.4d236fad83602f6a"}
{"t":2,"id":"ec617de5-5afb-41e6-850f-e22caf369801","ts":"@000004000000509a.4d236fad9cd3cf4a","v":"SGVsbG8sIFdvcmxkIQ=="}
{"t":3,"id":"60001e06-4ba1-452d-aa7d-53099e26c297","ts":"@000004000000509a.4d236fada98d9f3a","l":{"a":"ec617de5-5afb-41e6-850f-e22caf369801","b":"2044d9f9-0bcd-46b2-91ea-a3da8de613ec"}}
```

#### Binary

The DBOE Binary storage format is 168 bytes.

```
dboe��)�
D~�%yɀQ��5F��\AʦS,sC��!P�L��#K��0�×B�-M�3�;/�P�L��#e&�
Hello, World!3oI�M[���j���P�L��#q�a��×B�-M�3�;/�5F��\AʦS,sC��!
```
