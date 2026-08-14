package record

import "encoding/json"

type Value struct {
	data []byte
}

func (v Value) Data() []byte {
	return v.data
}

func (v Value) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.data)
}

func (v *Value) UnmarshalJSON(data []byte) error {
	var d []byte
	if err := json.Unmarshal(data, &d); err != nil {
		return err
	}
	v.data = d
	return nil
}
