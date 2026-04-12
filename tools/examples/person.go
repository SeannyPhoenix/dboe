package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/key"
	"github.com/seannyphoenix/dboe/pkg/meta/dimension"
	"github.com/seannyphoenix/dboe/pkg/meta/entity"
	"github.com/seannyphoenix/dboe/pkg/person"
)

var (
	Seanny = entity.Record{
		Key:       key.MustFrom(person.Person.ID, uuid.MustParse("598d10e4-d154-40a0-8c3c-8635321d2e6f")),
		CreatedAt: 1558310400, // 2019-05-20
	}
	SeannyName = dimension.Record{
		Key:       key.MustFrom(person.Name.ID, uuid.MustParse("7d87a026-1197-4d45-b78f-1039f4ee83bf")),
		Value:     []byte(`"Seanny Drakon Phoenix"`),
		Ref:       []key.Key{Seanny.Key},
		CreatedAt: time.Now().Unix(),
		Start:     "2019-09-20",
	}
)

func main() {
	b, err := json.Marshal(Seanny)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(b))

	b, err = json.Marshal(SeannyName)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(b))
}
