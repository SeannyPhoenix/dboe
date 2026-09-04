package serde

type Name string

type Ser[T any] interface {
	Ser(T) ([]byte, int, error)
}

type De[T any] interface {
	De([]byte) (T, int, error)
}

type SerDe[T any] interface {
	Ser[T]
	De[T]
}
