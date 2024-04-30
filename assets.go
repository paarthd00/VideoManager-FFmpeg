package main

func (a *App) GetAssets() ([]Video, error) {
	var videos []Video
	if err := DB.Find(&videos).Error; err != nil {
		return nil, err
	}

	return videos, nil
}
