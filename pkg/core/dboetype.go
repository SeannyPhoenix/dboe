package core

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/meta/dboetype"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var dboetypePrefix = namespace.Prefix{
	Distribution: "dboe",
	Domain:       "core",
	Kind:         "dboetype",
}

var (
	Boolean = dboetype.New(
		uuid.MustParse("6f15dde2-ac52-4e10-9018-c79cdd8cf188"),
		namespace.NamespaceFromPrefix(dboetypePrefix, "boolean"),
		[]byte(`{"type": "boolean"}`),
	)

	String = dboetype.New(
		uuid.MustParse("8a9892d1-c692-4ebf-8ad6-274e6414b189"),
		namespace.NamespaceFromPrefix(dboetypePrefix, "string"),
		[]byte(`{"type": "string"}`),
	)

	Integer = dboetype.New(
		uuid.MustParse("20d714e5-1373-45e1-a509-a18f66bb56b4"),
		namespace.NamespaceFromPrefix(dboetypePrefix, "integer"),
		[]byte(`{"type": "integer"}`),
	)

	Fixed128 = dboetype.New(
		uuid.MustParse("e15e17fc-6bfa-4812-a9f6-602020beb68d"),
		namespace.NamespaceFromPrefix(dboetypePrefix, "fixed128"),
		[]byte(`{"type": "string"}`),
	)

	BinaryTime = dboetype.New(
		uuid.MustParse("b1a2c3d4-e5f6-7890-abcd-ef0123456789"),
		namespace.NamespaceFromPrefix(dboetypePrefix, "binaryTime"),
		[]byte(`{"type": "string"}`),
	)
)
