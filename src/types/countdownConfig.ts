// 日期倒计时组件类型定义

export type CountdownEvent = {
	name: string; // 事件名称，如「万圣节」
	date: string; // 事件日期，格式 YYYY-MM-DD
	category?: string; // 事件分类标签，如「国际」
};

export type CountdownConfig = {
	events: CountdownEvent[]; // 事件列表，组件自动取最近的一个未来事件
};
