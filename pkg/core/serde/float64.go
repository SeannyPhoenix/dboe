package serde

import (
	"encoding/binary"
	"fmt"
	"math"
)

const Float64Name Name = "core:float64"

type sdfloat64 struct{}

var Float64 SerDe[float64] = sdfloat64{}

func (sdfloat64) Ser(v float64) ([]byte, int, error) {
	if v == 0 {
		return nil, 0, nil
	}
	data := make([]byte, 8)
	binary.BigEndian.PutUint64(data, math.Float64bits(v))
	return data, 8, nil
}

func (sdfloat64) De(b []byte) (float64, int, error) {
	if len(b) == 0 {
		return 0, 0, nil
	}
	if len(b) != 8 {
		return 0, 0, fmt.Errorf("invalid binary float64 data: %v", b)
	}
	return math.Float64frombits(binary.BigEndian.Uint64(b)), 8, nil
}
