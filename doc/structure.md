## Use

```mermaid
graph LR

t-et{Episode\nTitle}
t-d{Description}
t-l{Length}

lt-eos{Episode\nof\nSeason}

v-et(Pilot)
t-et --> v-et
v-et --> e1

v-d(Rick moves in with \nhis daughter's family...)
t-d --> v-d
v-d --> e1

v-l(22m)
t-l --> v-l
v-l --> e1

e1 -.-> lt-eos -.-> s1
```

## Types

### Value

```json
[
  {
    "id": "4cf7c8fe-0534-4234-91fb-5b3e250cf9e4",
    "l": "Episode Title",
    "s": "core:string"
  },
  {
    "id": "8db36ca4-21c5-467b-a44d-1b36fee12aa7",
    "l": "Description",
    "s": "core:string"
  },
  {
    "id": "2dc5414d-00d7-4a95-8dd6-24c6c4fca319",
    "l": "Length",
    "s": "time:duration"
  }
]
```

### Link

```json
[
  {
    "id": "d24d6ad6-6865-4d11-9914-b8230789a7f6",
    "l": "Episode of Season"
  }
]
```

## Data

### Value

```json
[
  {
    "id": "9b46cc12-b9f1-46e1-9305-b2c87eb9f946",
    "t": "4cf7c8fe-0534-4234-91fb-5b3e250cf9e4",
    "p": "a2424467-9e39-4070-ac04-5ec2892d837f",
    "ts": "now",
    "v": "Polit"
  },
  {
    "id": "f6c5b08e-c05c-4db7-b94f-0bdc30155310",
    "t": "8db36ca4-21c5-467b-a44d-1b36fee12aa7",
    "p": "a2424467-9e39-4070-ac04-5ec2892d837f",
    "ts": "now",
    "v": "Rick moves in with his daughter's family and establishes himiself as ..."
  },
  {
    "id": "e92331e1-06ae-4a25-8b3c-e6d71437e072",
    "t": "2dc5414d-00d7-4a95-8dd6-24c6c4fca319",
    "p": "a2424467-9e39-4070-ac04-5ec2892d837f",
    "ts": "now",
    "v": "22m"
  },
  {
    "id": "9b46cc12-b9f1-46e1-9305-b2c87eb9f946",
    "t": "4cf7c8fe-0534-4234-91fb-5b3e250cf9e4",
    "p": "a2424467-9e39-4070-ac04-5ec2892d837f",
    "ts": "later",
    "v": "Pilot"
  }
]
```

### Link

```json
[
  {
    "id": "01a06dad-7d61-72ec-8e0a-23d200283a74",
    "t": "d24d6ad6-6865-4d11-9914-b8230789a7f6",
    "ts": "now",
    "a": "a2424467-9e39-4070-ac04-5ec2892d837f",
    "b": "eafa7992-c2a4-4187-966d-bd2a55034c90"
  }
]
```

### Tombstones

```json
[]
```

# Indexes

## Links

```json
[
  {
    "a2424467-9e39-4070-ac04-5ec2892d837f": {
      "d24d6ad6-6865-4d11-9914-b8230789a7f6": {
        "atob": [
          {
            "linkId": "01a06dad-7d61-72ec-8e0a-23d200283a74",
            "to": "eafa7992-c2a4-4187-966d-bd2a55034c90"
          }
        ]
      }
    },
    "eafa7992-c2a4-4187-966d-bd2a55034c90": {
      "d24d6ad6-6865-4d11-9914-b8230789a7f6": {
        "btoa": {
          "linkId": "01a06dad-7d61-72ec-8e0a-23d200283a74",
          "to": "a2424467-9e39-4070-ac04-5ec2892d837f"
        }
      }
    }
  }
]
```

```
[a2424467-9e39-4070-ac04-5ec2892d837f][00000000][0000000d]
[eafa7992-c2a4-4187-966d-bd2a55034c90][0000000d][0000000d]
```

```
[d24d6ad6-6865-4d11-9914-b8230789a7f6][0001][0000]
[01a06dad-7d61-72ec-8e0a-23d200283a74][eafa7992-c2a4-4187-966d-bd2a55034c90]
[d24d6ad6-6865-4d11-9914-b8230789a7f6][0000][0001]
[01a06dad-7d61-72ec-8e0a-23d200283a74][a2424467-9e39-4070-ac04-5ec2892d837f]
```
