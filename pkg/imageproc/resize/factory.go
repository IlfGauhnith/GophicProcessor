package resize

import "fmt"

func GetResizeStrategy(algorithm string) (ResizeStrategy, error) {
	switch algorithm {
	case "bilinear":
		return &BilinearStrategy{}, nil
	case "nearest":
		return &NearestNeighborStrategy{}, nil
	case "bicubic":
		return &BicubicStrategy{}, nil
	case "lanczos2":
		return &Lanczos3Strategy{}, nil
	case "lanczos3":
		return &Lanczos3Strategy{}, nil
	default:
		return nil, fmt.Errorf("unknown resize algorithm: %s", algorithm)
	}
}
