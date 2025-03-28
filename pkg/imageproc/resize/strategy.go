package resize

import (
	"image"

	"github.com/nfnt/resize"
)

type ResizeStrategy interface {
	Resize(img image.Image, width uint, height uint) image.Image
}

type BilinearStrategy struct{}

func (b *BilinearStrategy) Resize(img image.Image, width uint, height uint) image.Image {
	return resize.Resize(width, height, img, resize.Bilinear)
}

type NearestNeighborStrategy struct{}

func (n *NearestNeighborStrategy) Resize(img image.Image, width uint, height uint) image.Image {
	return resize.Resize(width, height, img, resize.NearestNeighbor)
}

type BicubicStrategy struct{}

func (b *BicubicStrategy) Resize(img image.Image, width uint, height uint) image.Image {
	return resize.Resize(width, height, img, resize.Bicubic)
}

type Lanczos2Strategy struct{}

func (l *Lanczos2Strategy) Resize(img image.Image, width uint, height uint) image.Image {
	return resize.Resize(width, height, img, resize.Lanczos2)
}

type Lanczos3Strategy struct{}

func (l *Lanczos3Strategy) Resize(img image.Image, width uint, height uint) image.Image {
	return resize.Resize(width, height, img, resize.Lanczos3)
}
