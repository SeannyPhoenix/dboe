package core

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/seannyphoenix/binarytime/pkg/binarytime"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
	"github.com/seannyphoenix/dboe/pkg/meta/record"
)

var dboetypePrefix = namespace.Prefix{
	Distribution: "dboe",
	Domain:       "core",
	Kind:         "dboetype",
}

var (
	BooleanRecord = record.Record{
		ID:        uuid.MustParse("6f15dde2-ac52-4e10-9018-c79cdd8cf188"),
		CreatedAt: binarytime.Now(),
		Value:     json.RawMessage(namespace.NamespaceFromPrefix(dboetypePrefix, "boolean").String()),
	}

	StringRecord = record.Record{
		ID:        uuid.MustParse("8a9892d1-c692-4ebf-8ad6-274e6414b189"),
		CreatedAt: binarytime.Now(),
		Value:     json.RawMessage(namespace.NamespaceFromPrefix(dboetypePrefix, "string").String()),
	}

	Integer = record.Record{
		ID:        uuid.MustParse("20d714e5-1373-45e1-a509-a18f66bb56b4"),
		CreatedAt: binarytime.Now(),
		Value:     json.RawMessage(namespace.NamespaceFromPrefix(dboetypePrefix, "integer").String()),
	}

	Fixed128 = record.Record{
		ID:        uuid.MustParse("e15e17fc-6bfa-4812-a9f6-602020beb68d"),
		CreatedAt: binarytime.Now(),
		Value:     json.RawMessage(namespace.NamespaceFromPrefix(dboetypePrefix, "fixed128").String()),
	}

	BinaryTime = record.Record{
		ID:        uuid.MustParse("b1a2c3d4-e5f6-7890-abcd-ef0123456789"),
		CreatedAt: binarytime.Now(),
		Value:     json.RawMessage(namespace.NamespaceFromPrefix(dboetypePrefix, "binaryTime").String()),
	}
)
