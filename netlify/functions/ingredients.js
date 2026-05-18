exports.handler = async () => {
  const token = process.env.NOTION_TOKEN;
  const dbId = "e8feb71f6cba4a7dab56639a041cbf23";

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
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

    const data = await res.json();

    const items = data.results.map(page => ({
      id: page.id,
      이름: page.properties["이름"]?.title?.[0]?.plain_text || "",
      카테고리: page.properties["카테고리"]?.select?.name || "",
      재고상태: page.properties["재고상태"]?.select?.name || "",
      구입처: page.properties["구입처"]?.rich_text?.[0]?.plain_text || "",
      가격: page.properties["가격"]?.rich_text?.[0]?.plain_text || "",
      링크: page.properties["링크"]?.url || "",
      메모: page.properties["메모"]?.rich_text?.[0]?.plain_text || "",
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
