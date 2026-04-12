package person

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/core"
	"github.com/seannyphoenix/dboe/pkg/duration"
	"github.com/seannyphoenix/dboe/pkg/meta/dimension"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var dimensionPrefix = namespace.Prefix{
	Distribution: "dboe",
	Domain:       "person",
	Kind:         "dimension",
}

var (
	Name = dimension.New(
		uuid.MustParse("5010e412-5849-48c5-a7ad-c0ef26432df3"),
		namespace.NamespaceFromPrefix(dimensionPrefix, "name"),
		core.String,
	)

	BirthDateTime = dimension.New(
		uuid.MustParse("8eea0cf5-ffee-4099-9d23-f73010bb687b"),
		namespace.NamespaceFromPrefix(dimensionPrefix, "birthDateTime"),
		core.BinaryTime,
	)

	DeathDateTime = dimension.New(
		uuid.MustParse("cd5f6e81-ed1e-45ab-9826-5c68d8cef5f0"),
		namespace.NamespaceFromPrefix(dimensionPrefix, "deathDateTime"),
		core.BinaryTime,
	)

	Age = dimension.New(
		uuid.MustParse("0524cd21-a87a-43bd-95f2-31068078e491"),
		namespace.NamespaceFromPrefix(dimensionPrefix, "age"),
		core.Fixed128,
		dimension.WithUnit(duration.Day.ID),
	)
)
