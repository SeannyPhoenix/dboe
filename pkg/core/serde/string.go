package serde

const StringName Name = "core:string"

type sdstring struct{}

var String SerDe[string] = sdstring{}

func (sdstring) Ser(v string) ([]byte, int, error) {
	b := []byte(v)
	return b, len(b), nil
}

func (sdstring) De(b []byte) (string, int, error) {
	return string(b), len(b), nil
}
