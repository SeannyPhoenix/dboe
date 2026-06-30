package binary

import (
	"fmt"

	"github.com/google/uuid"
)

var (
	v0_1_0 = registerVersion(version{
		major: 0,
		minor: 1,
		patch: 0,
		uuid:  uuid.MustParse("e910b229-ff0a-447e-9c25-79c98051f4f8"),
	})

	Latest = v0_1_0
)

type version struct {
	major int
	minor int
	patch int
	uuid  uuid.UUID
}

var versions = map[uuid.UUID]version{}

func registerVersion(v version) version {
	versions[v.uuid] = v
	return v
}

func parseVersion(b []byte) (version, error) {
	uid, err := uuid.FromBytes(b)
	if err != nil {
		return version{}, fmt.Errorf("invalid UUID: %w", err)
	}
	v, ok := versions[uid]
	if !ok {
		return version{}, fmt.Errorf("unknown version: %x", b)
	}
	return v, nil
}
