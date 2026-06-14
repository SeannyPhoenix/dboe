package namespace

import (
	"fmt"
	"strings"
)

type (
	Distribution string
	Domain       string
	Kind         string
	Name         string
)

type Prefix struct {
	Distribution string
	Domain       string
	Kind         string
}

type Namespace struct {
	Distribution string
	Domain       string
	Kind         string
	Name         string
}

func Parse(s string) (Namespace, error) {
	parts := strings.Split(s, ":")
	if len(parts) != 4 {
		return Namespace{}, fmt.Errorf("namespace: expected 4 segments, got %d: %q", len(parts), s)
	}
	ns := Namespace{
		Distribution: parts[0],
		Domain:       parts[1],
		Kind:         parts[2],
		Name:         parts[3],
	}
	if !ns.IsValid() {
		return Namespace{}, fmt.Errorf("namespace: empty segment in %q", s)
	}
	return ns, nil
}

func (ns Namespace) IsValid() bool {
	return len(ns.Distribution) > 0 && len(ns.Domain) > 0 && len(ns.Kind) > 0 && len(ns.Name) > 0
}

func (ns Namespace) String() string {
	if !ns.IsValid() {
		return "<Invalid Namespace>"
	}
	return ns.Distribution + ":" + ns.Domain + ":" + ns.Kind + ":" + ns.Name
}

func NamespaceFromPrefix(prefix Prefix, name string) Namespace {
	return Namespace{
		Distribution: prefix.Distribution,
		Domain:       prefix.Domain,
		Kind:         prefix.Kind,
		Name:         name,
	}
}
