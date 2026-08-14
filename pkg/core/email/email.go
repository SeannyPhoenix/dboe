package email

import (
	"io"
	"net/mail"
)

func Parse(r io.Reader) (*mail.Message, error) {
	msg, err := mail.ReadMessage(r)
	if err != nil {
		return nil, err
	}
	return msg, nil
}
