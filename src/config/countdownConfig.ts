import type { CountdownConfig } from "../types/countdownConfig";

/**
 * 日期倒计时组件配置
 *
 * 事件日期使用 YYYY-MM-DD 格式（按访问者本地时区计算）。
 * 组件会自动跳过已经过去的事件，只显示距离最近一个事件的天数。
 */
export const countdownConfig: CountdownConfig = {
	events: [
		{ name: "万圣节", date: "2026-10-31", category: "国际" },
		{ name: "平安夜", date: "2026-12-24", category: "国际" },
		{ name: "圣诞节", date: "2026-12-25", category: "国际" },
		{ name: "元旦", date: "2027-01-01", category: "国际" },
		{ name: "春节", date: "2027-02-06", category: "传统" },
		{ name: "情人节", date: "2027-02-14", category: "国际" },
		{ name: "愚人节", date: "2027-04-01", category: "国际" },
		{ name: "劳动节", date: "2027-05-01", category: "国际" },
		{ name: "儿童节", date: "2027-06-01", category: "国际" },
		{ name: "国庆节", date: "2027-10-01", category: "传统" },
	],
};
