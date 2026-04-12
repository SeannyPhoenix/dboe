package duration

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/fixed128"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
	"github.com/seannyphoenix/dboe/pkg/meta/unit"
)

var unitPrefix = namespace.Prefix{
	Distribution: "dboe",
	Domain:       "duration",
	Kind:         "unit",
}

var (
	Nanosecond = unit.New(
		uuid.MustParse("e79c8b37-d2d8-4291-b8eb-39178e397317"),
		namespace.NamespaceFromPrefix(unitPrefix, "nanosecond"),
		fixed128.MustNew(1, 86_400_000_000_000),
	)

	Microsecond = unit.New(
		uuid.MustParse("d88ad9d9-b573-4eb7-a135-2ef4f26e7dbc"),
		namespace.NamespaceFromPrefix(unitPrefix, "microsecond"),
		fixed128.MustNew(1, 86_400_000_000),
	)

	Millisecond = unit.New(
		uuid.MustParse("3d6de412-0b46-4c51-9cdb-4d7b4ddb7106"),
		namespace.NamespaceFromPrefix(unitPrefix, "millisecond"),
		fixed128.MustNew(1, 86_400_000),
	)

	Second = unit.New(
		uuid.MustParse("e9376d42-8baf-41e6-b276-0c50114d45a4"),
		namespace.NamespaceFromPrefix(unitPrefix, "second"),
		fixed128.MustNew(1, 86_400),
	)

	Minute = unit.New(
		uuid.MustParse("b5a63813-57fa-4a7e-9542-b0f6ffdd42b9"),
		namespace.NamespaceFromPrefix(unitPrefix, "minute"),
		fixed128.MustNew(1, 1_440),
	)

	Day = unit.New(
		uuid.MustParse("79f9b4f6-9b05-4e79-aac9-1fdc6c53a51c"),
		namespace.NamespaceFromPrefix(unitPrefix, "day"),
		fixed128.MustNew(1, 1),
	)

	Week = unit.New(
		uuid.MustParse("0dc91244-ee9b-44e5-a940-5e22423fe778"),
		namespace.NamespaceFromPrefix(unitPrefix, "week"),
		fixed128.MustNew(7, 1),
	)

	Fortnight = unit.New(
		uuid.MustParse("b9b4e43e-bef3-4c6d-84bd-e23163341fa1"),
		namespace.NamespaceFromPrefix(unitPrefix, "fortnight"),
		fixed128.MustNew(14, 1),
	)

	Month = unit.New(
		uuid.MustParse("1668f2ff-45c8-44ac-a0d8-c78b15de6d43"),
		namespace.NamespaceFromPrefix(unitPrefix, "month"),
		fixed128.MustNew(30436875, 1000000),
	)

	Year = unit.New(
		uuid.MustParse("24f778fd-5b67-4dd8-bf2d-034172383d73"),
		namespace.NamespaceFromPrefix(unitPrefix, "year"),
		fixed128.MustNew(3652425, 10000),
	)
)
