// Book covers.
// The backend does not store images, so we:
//   1) try the real cover from Open Library using the ISBN
//   2) if it does not exist (or there is no internet), draw our own cover (SVG)

function coverUrl(book) {
  const isbn = String(book.isbn || "").replace(/[^0-9Xx]/g, "");
  if (!isbn) return generatedCover(book);
  // default=false -> answers 404 when there is no cover, so the fallback runs
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
}

function escapeXml(text) {
  return String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

// Splits a title into short lines so it fits on the cover
function wrapText(text, maxChars, maxLines) {
  const lines = [];
  let current = "";
  text.split(/\s+/).forEach((word) => {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  });
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] += "...";
  }
  return lines;
}

// The color is calculated from the title, so each book always gets the same one
function hashCode(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function generatedCover(book) {
  const hue = hashCode(String(book.title)) % 360;
  const lines = wrapText(String(book.title), 14, 4);
  const titleLines = lines
    .map((line, index) => `<tspan x="150" dy="${index === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`)
    .join("");
  const author = String(book.author).length > 28 ? String(book.author).slice(0, 27) + "..." : String(book.author);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" fill="hsl(${hue}, 55%, 36%)"/>
  <rect x="16" y="16" width="268" height="368" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>
  <text x="150" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#fff">${titleLines}</text>
  <text x="150" y="350" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#fff" fill-opacity="0.9">${escapeXml(author)}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
