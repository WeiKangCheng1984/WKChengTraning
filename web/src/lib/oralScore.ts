/** Word-level alignment score for oral practice (target vs transcript). */

export type WordMark = {
  word: string;
  status: "ok" | "missing" | "extra" | "wrong";
};

export type OralScore = {
  score: number;
  matched: number;
  total: number;
  marks: WordMark[];
  heard: string;
};

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(Boolean);
}

/** Simple DP alignment (Levenshtein path) for word sequences. */
export function scoreOral(target: string, transcript: string): OralScore {
  const a = tokenize(target);
  const b = tokenize(transcript);
  const n = a.length;
  const m = b.length;

  if (n === 0) {
    return { score: 0, matched: 0, total: 0, marks: [], heard: transcript };
  }

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  );
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  const marks: WordMark[] = [];
  let i = n;
  let j = m;
  const ops: Array<{ type: "ok" | "missing" | "extra" | "wrong"; word: string }> =
    [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      ops.push({ type: "ok", word: a[i - 1] });
      i--;
      j--;
    } else if (
      i > 0 &&
      j > 0 &&
      dp[i][j] === dp[i - 1][j - 1] + 1
    ) {
      ops.push({ type: "wrong", word: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      ops.push({ type: "extra", word: b[j - 1] });
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ type: "missing", word: a[i - 1] });
      i--;
    } else if (i > 0) {
      ops.push({ type: "missing", word: a[i - 1] });
      i--;
    } else {
      ops.push({ type: "extra", word: b[j - 1] });
      j--;
    }
  }
  ops.reverse();
  for (const op of ops) {
    marks.push({ word: op.word, status: op.type });
  }

  const matched = marks.filter((x) => x.status === "ok").length;
  const score = Math.round((matched / n) * 100);
  return { score, matched, total: n, marks, heard: transcript };
}
