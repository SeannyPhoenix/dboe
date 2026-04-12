package key

import (
	"fmt"

	"github.com/google/uuid"
)

// Key is a 32-byte composite primary key: [type UUID (16 bytes)][id UUID (16 bytes)].
type Key [32]byte

// New generates a Key with a new random (v4) UUID as the ID.
// Returns an error if typ is uuid.Nil.
func New(typ uuid.UUID) (Key, error) {
	return From(typ, uuid.Must(uuid.NewV7()))
}

// MustNew is like New but panics on error.
func MustNew(typ uuid.UUID) Key {
	k, err := New(typ)
	if err != nil {
		panic(err)
	}
	return k
}

// From constructs a Key from explicit type and ID UUIDs.
// Returns an error if either is uuid.Nil.
func From(typ, id uuid.UUID) (Key, error) {
	if typ == uuid.Nil {
		return Key{}, fmt.Errorf("key: type UUID must not be nil")
	}
	if id == uuid.Nil {
		return Key{}, fmt.Errorf("key: id UUID must not be nil")
	}
	var k Key
	copy(k[:16], typ[:])
	copy(k[16:], id[:])
	return k, nil
}

// MustFrom is like From but panics on error.
func MustFrom(typ, id uuid.UUID) Key {
	k, err := From(typ, id)
	if err != nil {
		panic(err)
	}
	return k
}

// Type returns the type UUID portion of the key.
func (k Key) Type() uuid.UUID {
	return uuid.UUID(k[:16])
}

// ID returns the ID UUID portion of the key.
func (k Key) ID() uuid.UUID {
	return uuid.UUID(k[16:])
}

// MarshalText implements encoding.TextMarshaler.
// Format: "<type>:<id>"
func (k Key) MarshalText() ([]byte, error) {
	return []byte(k.Type().String() + ":" + k.ID().String()), nil
}

// UnmarshalText implements encoding.TextUnmarshaler.
// Expects format "<type>:<id>" where each part is a standard UUID string.
func (k *Key) UnmarshalText(data []byte) error {
	if len(data) != 73 {
		return fmt.Errorf("key: expected 73-byte text (uuid:uuid), got %d bytes", len(data))
	}
	if data[36] != ':' {
		return fmt.Errorf("key: expected ':' at index 36, got %q", data[36])
	}
	typ, err := uuid.ParseBytes(data[:36])
	if err != nil {
		return fmt.Errorf("key: invalid type UUID: %w", err)
	}
	id, err := uuid.ParseBytes(data[37:])
	if err != nil {
		return fmt.Errorf("key: invalid id UUID: %w", err)
	}
	copy(k[:16], typ[:])
	copy(k[16:], id[:])
	return nil
}

// MarshalBinary implements encoding.BinaryMarshaler.
func (k Key) MarshalBinary() ([]byte, error) {
	b := make([]byte, 32)
	copy(b, k[:])
	return b, nil
}

// UnmarshalBinary implements encoding.BinaryUnmarshaler.
func (k *Key) UnmarshalBinary(data []byte) error {
	if len(data) != 32 {
		return fmt.Errorf("key: expected 32 bytes, got %d", len(data))
	}
	copy(k[:], data)
	return nil
}
