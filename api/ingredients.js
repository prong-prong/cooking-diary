export default async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  const dbId = "e8feb71f6cba4a7dab56639a041cbf23";

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [
          { property: "재고상태", direction: "ascending" },
          { property: "카테고리", direction: "ascending" },
        ],
        page_size: 100,
      }),
    });

    const data = await response.json();

    const items = data.results.map(page => ({
      id: page.id,
      이름: page.properties["이름"]?.title?.[0]?.plain_text || "",
      카테고리: page.properties["카테고리"]?.select?.name || "",
      재고상태: page.properties["재고상태"]?.select?.name || "",
      구입처: page.properties["구입처"]?.rich_text?.[0]?.plain_text || "",
      가격: page.properties["가격"]?.rich_text?.[0]?.plain_text || "",
      링크: page.properties["링크"]?.url || "",
      메모: page.properties["메모"]?.rich_text?.[0]?.plain_text || "",
      마지막구매일: page.properties["마지막 구매일"]?.date?.start || "",
    }));

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
