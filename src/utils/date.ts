export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateString = date.toISOString().split("T")[0];
  const todayString = today.toISOString().split("T")[0];
  const yesterdayString = yesterday.toISOString().split("T")[0];

  if (dateString === todayString) return "今天";
  if (dateString === yesterdayString) return "昨天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};
