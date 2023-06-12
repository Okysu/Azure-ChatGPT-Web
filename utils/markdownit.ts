import markdownit from "markdown-it";
import { v4 as uuidv4 } from "uuid";
import hljs from "highlight.js";

export const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string): string {
    const uuid = uuidv4();
    let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${uuid}">复制</button>`;
    const linesLength = str.split(/\n/).length - 1;
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
    for (let index = 0; index < linesLength; index++) {
      linesNum = linesNum + "<span></span>";
    }
    linesNum += "</span>";
    if (lang && hljs.getLanguage(lang)) {
      try {
        const preCode = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        html = html + preCode;
        if (linesLength) {
          html += '<b class="name">' + lang + "</b>";
        }
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${uuid}">${str.replace(
          /<\/textarea>/g,
          "&lt;/textarea>"
        )}</textarea>`;
      } catch (error) {
        console.log(error);
      }
    }

    const preCode = md.utils.escapeHtml(str);
    html = html + preCode;
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${uuid}">${str.replace(
      /<\/textarea>/g,
      "&lt;/textarea>"
    )}</textarea>`;
  },
})
