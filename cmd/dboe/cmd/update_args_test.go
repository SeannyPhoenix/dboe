package cmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUpdateArgsCountCorrect(t *testing.T) {
	require := require.New(t)

	args := []string{"update", validUUID, "42"}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestUpdateArgsCountIncorrect(t *testing.T) {
	require := require.New(t)

	for _, i := range []int{0, 1, 3, 4} {
		args := []string{"update"}
		for range i {
			args = append(args, "arg")
		}

		err := executeRoot(t, args)
		require.Error(err)
	}
}

func TestUpdateArgsParsePass(t *testing.T) {
	require := require.New(t)

	args := []string{"update", validUUID, "42"}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestUpdateArgsParseError(t *testing.T) {
	tt := []struct {
		name    string
		args    []string
		wantErr string
	}{
		{
			name:    "invalid record ID",
			args:    []string{"update", "not-a-uuid", "42"},
			wantErr: "invalid record ID",
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
