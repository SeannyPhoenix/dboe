package cmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAddTypeMissing(t *testing.T) {
	require := require.New(t)

	args := []string{"add"}
	err := executeRoot(t, args)
	require.Error(err)
}

func TestAddTypeInvalid(t *testing.T) {
	require := require.New(t)

	args := []string{"add", "nope"}
	err := executeRoot(t, args)
	require.Error(err)
}

func TestAddEntityArgsCountCorrect(t *testing.T) {
	require := require.New(t)

	args := []string{"add", "entity"}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestAddEntityArgsCountIncorrect(t *testing.T) {
	require := require.New(t)

	for _, i := range []int{1, 2, 3} {
		args := []string{"add", "entity"}
		for range i {
			args = append(args, "arg")
		}

		err := executeRoot(t, args)
		require.Error(err)
	}
}

func TestAddValueArgsCountCorrect(t *testing.T) {
	require := require.New(t)

	args := []string{"add", "value", "42"}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestAddValueArgsCountIncorrect(t *testing.T) {
	require := require.New(t)

	for _, i := range []int{0, 2, 3} {
		args := []string{"add", "value"}
		for range i {
			args = append(args, "arg")
		}

		err := executeRoot(t, args)
		require.Error(err)
	}
}

func TestAddLinkArgsCountCorrect(t *testing.T) {
	require := require.New(t)

	args := []string{"add", "link", validUUID, validUUID}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestAddLinkArgsCountIncorrect(t *testing.T) {
	require := require.New(t)

	for _, i := range []int{0, 1, 3, 4} {
		args := []string{"add", "link"}
		for range i {
			args = append(args, "arg")
		}

		err := executeRoot(t, args)
		require.Error(err)
	}
}

func TestAddLinkArgsParsePass(t *testing.T) {
	require := require.New(t)

	args := []string{"add", "link", validUUID, validUUID}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestAddLinkArgsParseError(t *testing.T) {
	tt := []struct {
		name    string
		args    []string
		wantErr string
	}{
		{
			name:    "invalid UUID A",
			args:    []string{"add", "link", "not-a-uuid", validUUID},
			wantErr: "parse uuid A",
		},
		{
			name:    "invalid UUID B",
			args:    []string{"add", "link", validUUID, "not-a-uuid"},
			wantErr: "parse uuid B",
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			require := require.New(t)
			assert := assert.New(t)

			err := executeRoot(t, tc.args)
			require.Error(err)
			assert.Contains(err.Error(), tc.wantErr)
		})
	}
}
