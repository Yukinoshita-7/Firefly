import type { CountdownEvent } from "../types/countdownConfig";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export type CountdownPeriodKey = "year" | "month" | "week" | "today";

export type CountdownUnit = "days" | "hours" | "minutes";

export type CountdownPeriod = {
	key: CountdownPeriodKey;
	percent: number; // 周期已过去的百分比（0–100）
	remaining: number; // 周期内剩余数量，单位见 unit
	unit: CountdownUnit;
};

export type CountdownNextEvent = CountdownEvent & {
	daysLeft: number; // 距离事件还有多少天，事件当天为 0
};

export type CountdownSnapshot = {
	dateText: string;
	periods: CountdownPeriod[];
	nextEvent: CountdownNextEvent | null;
};

const clampPercent = (value: number): number =>
	Math.min(100, Math.max(0, Math.round(value * 10) / 10));

/** 格式化组件顶部的日期，如「2026年10月22日 周四」 */
export function formatCountdownDate(now: Date, locale: string): string {
	const dateText = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(now);
	const weekdayText = new Intl.DateTimeFormat(locale, {
		weekday: "short",
	}).format(now);
	return `${dateText} ${weekdayText}`;
}

/** 解析 YYYY-MM-DD，返回当天的 UTC 时间戳（仅用于做整数天差值计算） */
function parseEventDay(date: string): number | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const timestamp = Date.UTC(year, month - 1, day);
	return Number.isNaN(timestamp) ? null : timestamp;
}

/** 找到下一个尚未过去的事件（事件当天仍算作未过去） */
export function getNextCountdownEvent(
	now: Date,
	events: CountdownEvent[],
): CountdownNextEvent | null {
	const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
	const upcoming = events
		.map((event) => {
			const day = parseEventDay(event.date);
			if (day === null) return null;
			const daysLeft = Math.round((day - today) / DAY_MS);
			return daysLeft >= 0 ? { ...event, daysLeft } : null;
		})
		.filter((event): event is CountdownNextEvent => event !== null)
		.sort((a, b) => a.daysLeft - b.daysLeft);

	return upcoming[0] ?? null;
}

/**
 * 计算某一时刻的倒计时快照。
 *
 * 年内/月内/周内百分比按「当前这一天已计入」计算，与剩余天数的口径保持一致；
 * 今日百分比按当天已过去的时长连续计算。
 */
export function getCountdownSnapshot(
	now: Date,
	events: CountdownEvent[],
	locale: string,
): CountdownSnapshot {
	const year = now.getFullYear();
	const month = now.getMonth();
	const date = now.getDate();

	const startOfYear = Date.UTC(year, 0, 1);
	const startOfNextYear = Date.UTC(year + 1, 0, 1);
	const daysInYear = Math.round((startOfNextYear - startOfYear) / DAY_MS);
	const dayOfYear =
		Math.round((Date.UTC(year, month, date) - startOfYear) / DAY_MS) + 1;
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// 周一为一周的开始：周一 0 … 周日 6
	const weekdayIndex = (now.getDay() + 6) % 7;
	const secondsOfDay =
		now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

	const daysLeftYear = Math.max(0, daysInYear - dayOfYear);
	const daysLeftMonth = Math.max(0, daysInMonth - date);
	const daysLeftWeek = Math.max(0, 6 - weekdayIndex);

	const msLeftToday = Math.max(0, 24 * 3600 * 1000 - secondsOfDay * 1000);
	const useMinutes = msLeftToday < HOUR_MS;

	const periods: CountdownPeriod[] = [
		{
			key: "year",
			percent: clampPercent((dayOfYear / daysInYear) * 100),
			remaining: daysLeftYear,
			unit: "days",
		},
		{
			key: "month",
			percent: clampPercent((date / daysInMonth) * 100),
			remaining: daysLeftMonth,
			unit: "days",
		},
		{
			key: "week",
			percent: clampPercent(((weekdayIndex + 1) / 7) * 100),
			remaining: daysLeftWeek,
			unit: "days",
		},
		{
			key: "today",
			percent: clampPercent((secondsOfDay / 86400) * 100),
			remaining: useMinutes
				? Math.max(1, Math.ceil(msLeftToday / 60000))
				: Math.max(1, Math.ceil(msLeftToday / HOUR_MS)),
			unit: useMinutes ? "minutes" : "hours",
		},
	];

	return {
		dateText: formatCountdownDate(now, locale),
		periods,
		nextEvent: getNextCountdownEvent(now, events),
	};
}
