package cmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDeleteArgsCountCorrect(t *testing.T) {
	require := require.New(t)

	args := []string{"delete", validUUID}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestDeleteArgsCountIncorrect(t *testing.T) {
	require := require.New(t)

	for _, i := range []int{0, 2, 3} {
		args := []string{"delete"}
		for range i {
			args = append(args, "arg")
		}

		err := executeRoot(t, args)
		require.Error(err)
	}
}

func TestDeleteArgsParsePass(t *testing.T) {
	require := require.New(t)

	args := []string{"delete", validUUID}
	err := executeRoot(t, args)
	require.NoError(err)
}

func TestDeleteArgsParseError(t *testing.T) {
	tt := []struct {
		name    string
		args    []string
		wantErr string
	}{
		{
			name:    "invalid record ID",
			args:    []string{"delete", "not-a-uuid"},
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
