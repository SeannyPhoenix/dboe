package serde

import (
	"encoding/binary"
	"fmt"
)

const Int64Name Name = "core:int64"

type sdint64 struct{}

var Int64 SerDe[int64] = sdint64{}

func (sdint64) Ser(v int64) ([]byte, int, error) {
	if v == 0 {
		return nil, 0, nil
	}
	data := make([]byte, 8)
	binary.PutVarint(data, int64(v))
	return data, len(data), nil
}

func (sdint64) De(b []byte) (int64, int, error) {
	if len(b) == 0 {
		return 0, 0, nil
	}
	v, n := binary.Varint(b)
	if n <= 0 {
		return 0, 0, fmt.Errorf("invalid binary int64 data: %v", b)
	}
	return v, n, nil
}
