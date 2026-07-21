export type WeatherConfig = {
	// 城市名称（显示用）
	city: string;
	// 纬度
	latitude: number;
	// 经度
	longitude: number;
	// 温度单位："celsius" | "fahrenheit"
	unit?: "celsius" | "fahrenheit";
};
