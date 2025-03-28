package util

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/jpeg"
)

func DecodeBase64Image(base64Str string) (image.Image, error) {
	decoded, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		return nil, fmt.Errorf("failed to decode base64: %v", err)
	}

	img, _, err := image.Decode(bytes.NewReader(decoded))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %v", err)
	}
	return img, nil
}

func EncodeBase64Image(img image.Image) (string, error) {
	var buf bytes.Buffer
	err := jpeg.Encode(&buf, img, nil)
	if err != nil {
		return "", fmt.Errorf("failed to encode image: %v", err)
	}
	return base64.StdEncoding.EncodeToString(buf.Bytes()), nil
}
