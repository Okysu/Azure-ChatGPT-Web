export const safeHtml = (html: string, strict?: boolean): string => {
  // del script tag
  const value = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/g, "");
  // if strict mode, del all html tag
  if (strict) {
    return value.replace(/<[^>]+>/g, "");
  }
  return html;
};

type Color = {
  r: number;
  g: number;
  b: number;
};

export const randomColor = (): Color => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
};

export const colorToHex = (color: Color): string => {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

export const hexToColor = (hex: string): Color => {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
    throw new Error("Invalid hex color");
  }
  const rgb = hex.slice(1).match(/.{1,2}/g) || [];
  return {
    r: parseInt(rgb[0]!, 16),
    g: parseInt(rgb[1]!, 16),
    b: parseInt(rgb[2]!, 16),
  };
};

export const getMatchingTextColor = (color: Color | string): string => {
  const inputColor = typeof color === "string" ? hexToColor(color) : color;
  const { r, g, b } = inputColor;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};
