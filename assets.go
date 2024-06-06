package main

func (a *App) GetAssets() []Video {
	var videos []Video
	if err := DB.Find(&videos).Error; err != nil {
		return nil
	}

	return videos
}
