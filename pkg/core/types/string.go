package types

import (
	"github.com/google/uuid"
)

// c3454ac4-8fa9-4d37-87d9-33f886f0a39e
var CoreString = uuid.UUID{
	0xc3, 0x45, 0x4a, 0xc4,
	0x8f, 0xa9,
	0x4d, 0x37,
	0x87, 0xd9,
	0x33, 0xf8, 0x86, 0xf0, 0xa3, 0x9e,
}

type String string

var _ Type = (*String)(nil)

func NewString(s string) String {
	return String(s)
}

func (s String) TypeName() string {
	return "string"
}

func (s String) String() string {
	return string(s)
}

func (s String) MarshalText() ([]byte, error) {
	return []byte(s), nil
}

func (s *String) UnmarshalText(data []byte) error {
	*s = String(data)
	return nil
}

func (s String) MarshalBinary() ([]byte, error) {
	return []byte(s), nil
}

func (s *String) UnmarshalBinary(data []byte) error {
	*s = String(data)
	return nil
}
