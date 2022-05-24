import {formatDistance, format, isSameDay, subDays} from "date-fns";
import {utcToZonedTime} from "date-fns-tz";

export function getContent(text) {
  text = text.replaceAll(/@[a-z]+|#[a-z]+/gi, function(match) {
    if (match[0] === "@") return `<a href=/${match.slice(1)} >${match}</a>`;
    return `<a href=/tweets/hashtag/${match.slice(1)} >${match}</a>`;
  });

  return linkify(text);
}

function linkify(text) {
  var urlRegex = /(\b(((https?|ftp|file):\/\/)|(www.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  let last;
  text = text.replace(urlRegex, function(url) {
    last = url;
    return (
      '<a href="' +
      url +
      '" target="_blank" class="underline text-sm text-blue font-semibold ">' +
      url.slice(0, 20) +
      "... </a>"
    );
  });

  if (last && last[0] == "w") last = "https://" + last;

  return [last, text];
}

export function lastUrl(text) {
  // var urlRegex = /(\b(((https?|ftp|file):\/\/)|(www.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?!.*\b(((https?|ftp|file):\/\/)|(www.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  var urlRegex = /(\b(((https?|ftp|file):\/\/))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?!.*\b((https?|ftp|file):\/\/)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  let last;
  text = text.replace(urlRegex, (url) => {
    last = url;
    return "";
  });

  return [text, last];
}

export function getMentions(text) {
  return Array.from(
    new Set(text.match(/@\S+/gi)?.map((curr) => curr.slice(1))) || []
  );
}

export function formatNumbers(num) {
  num = Number(num);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
}

export function getDate(date) {
  if (!date) return;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();
  const tweetDate = utcToZonedTime(date, timezone);
  return formatDistance(tweetDate, today, {addSuffix: false})
    .replace(/hours?/, "hr")
    .replace("about", "")
    .replace(`less than a minute`, "< m")
    .replace("minutes", "m");
}
