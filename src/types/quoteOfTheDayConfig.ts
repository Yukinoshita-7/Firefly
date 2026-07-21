export type QuoteOfTheDayConfig = {
	title?: string; // 组件标题
	quotes: {
		text: string; // 名言内容
		author?: string; // 作者
	}[];
};
