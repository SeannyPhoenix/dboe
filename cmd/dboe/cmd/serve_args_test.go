package cmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParseServePortPass(t *testing.T) {
	require := require.New(t)

	port, err := parseServePort(8080)
	require.NoError(err)
	require.Equal(8080, port)
}

func TestParseServePortError(t *testing.T) {
	tt := []struct {
		name    string
		port    int
		wantErr string
	}{
		{
			name:    "too low",
			port:    0,
			wantErr: "must be between 1 and 65535",
		},
		{
			name:    "too high",
			port:    65536,
			wantErr: "must be between 1 and 65535",
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			require := require.New(t)
			assert := assert.New(t)

			_, err := parseServePort(tc.port)
			require.Error(err)
			assert.Contains(err.Error(), tc.wantErr)
		})
	}
}

func TestServePortFlagTypeError(t *testing.T) {
	require := require.New(t)
	assert := assert.New(t)

	args := []string{"serve", "--port", "abc"}
	err := executeRoot(t, args)
	require.Error(err)
	assert.Contains(err.Error(), "invalid argument")
}
