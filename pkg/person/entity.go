package person

import (
	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/meta/entity"
	"github.com/seannyphoenix/dboe/pkg/meta/namespace"
)

var entityPrefix = namespace.Prefix{
	Distribution: "dboe",
	Domain:       "person",
	Kind:         "entity",
}

var (
	Person = entity.New(
		uuid.MustParse("fce6a6a7-0370-4106-a737-7502780b8144"),
		namespace.NamespaceFromPrefix(entityPrefix, "person"),
	)
)

func NewPerson() entity.Record {
	return entity.NewRecord(Person)
}
