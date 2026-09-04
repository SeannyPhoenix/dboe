package serde

import (
	"fmt"
)

const BooleanName Name = "core:boolean"

type sdbool struct{}

var Bool SerDe[bool] = sdbool{}

func (sdbool) Ser(v bool) ([]byte, int, error) {
	if v {
		return []byte{1}, 1, nil
	}
	return nil, 0, nil
}

func (sdbool) De(b []byte) (bool, int, error) {
	if len(b) == 0 {
		return false, 0, nil
	}
	if len(b) > 1 || b[0] != 1 {
		return false, 0, fmt.Errorf("invalid boolean data: %v", b)
	}
	return true, 1, nil
}
