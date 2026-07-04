package binary

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/seannyphoenix/dboe/pkg/record"
)

type InvalidHeaderLengthError struct {
	len int
}

func (e *InvalidHeaderLengthError) Error() string {
	return fmt.Sprintf("invalid header length: expected %d, got %d", fileHeaderSize, e.len)
}

type InvalidHeaderPrefixError struct {
	got []byte
}

func (e *InvalidHeaderPrefixError) Error() string {
	return fmt.Sprintf("invalid header prefix: expected %s, got %s", string(prefix), string(e.got))
}

type InvalidHeaderVersionError struct {
	cause error
}

func (e *InvalidHeaderVersionError) Error() string {
	return fmt.Sprintf("invalid header version: %s", e.cause.Error())
}

type InvalidRecordError struct {
	record record.Record
}

func (err InvalidRecordError) Error() string {
	return fmt.Sprintf("invalid record: %+v", err.record)
}

func (err InvalidRecordError) Record() record.Record {
	return err.record
}

type InvalidRecordHeaderLengthError struct {
	len int
}

func (e *InvalidRecordHeaderLengthError) Error() string {
	return fmt.Sprintf("invalid record header length: expected %d, got %d", recordHeaderSize, e.len)
}

func (e *InvalidRecordHeaderLengthError) Length() int {
	return e.len
}

type InvalidOffsetError struct {
	offset int64
}

func (err InvalidOffsetError) Error() string {
	return fmt.Sprintf("invalid offset %d", err.offset)
}

type InvalidValueSizeError struct {
	actualSize int
	maxSize    int64
}

func (e *InvalidValueSizeError) Error() string {
	return fmt.Sprintf("invalid value size: got %d, max allowed %d", e.actualSize, e.maxSize)
}

func (e *InvalidValueSizeError) ActualSize() int {
	return e.actualSize
}

func (e *InvalidValueSizeError) MaxSize() int64 {
	return e.maxSize
}

type UnknownVersionError struct {
	uuid uuid.UUID
}

func (e *UnknownVersionError) Error() string {
	return fmt.Sprintf("unknown version: %s", e.uuid.String())
}

func (e *UnknownVersionError) UUID() uuid.UUID {
	return e.uuid
}

type RecordTypeMismatchError struct {
	actual   record.Type
	expected record.Type
}

func (e *RecordTypeMismatchError) Error() string {
	return fmt.Sprintf("record type mismatch: expected %v, got %v", e.expected, e.actual)
}

func (e *RecordTypeMismatchError) Actual() record.Type {
	return e.actual
}

func (e *RecordTypeMismatchError) Expected() record.Type {
	return e.expected
}

type InvalidLinkError struct {
	side  string // "a" or "b"
	cause error
}

func (e *InvalidLinkError) Error() string {
	return fmt.Sprintf("invalid link UUID %s: %s", e.side, e.cause.Error())
}

func (e *InvalidLinkError) Side() string {
	return e.side
}

func (e *InvalidLinkError) Cause() error {
	return e.cause
}
