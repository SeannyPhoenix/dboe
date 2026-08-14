package types

import "encoding"

type Type interface {
	TypeName() string

	encoding.TextMarshaler
	encoding.TextUnmarshaler
	encoding.BinaryMarshaler
	encoding.BinaryUnmarshaler
}
