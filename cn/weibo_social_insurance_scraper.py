#!/usr/bin/env python3
"""
Scrape Weibo posts about delivery riders' social insurance and willingness to join.

IMPORTANT:
- Respect Weibo ToS and local laws.
- This script uses the official web search endpoint that requires a logged-in
  cookie. Provide your own credentials via environment variables.

Usage:
  export WEIBO_COOKIE='SUB=...; SUBP=...; XSRF-TOKEN=...'
  export WEIBO_XSRF='your_xsrf_token'
  python weibo_social_insurance_scraper.py --start 2024-01-01 --end 2024-12-31 \
      --out weibo_rider_social_insurance.jsonl
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from typing import Iterable

import requests

SEARCH_URL = "https://weibo.com/ajax/statuses/search"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)

DEFAULT_QUERIES = [
    "外卖骑手 社保",
    "外卖员 社保",
    "外卖骑手 参保 意愿",
    "外卖骑手 参保",
    "骑手 社会保险",
    "外卖骑手 五险一金",
]


@dataclass
class WeiboConfig:
    cookie: str
    xsrf: str


class WeiboScraper:
    def __init__(self, config: WeiboConfig) -> None:
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": USER_AGENT,
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://s.weibo.com/",
                "X-Requested-With": "XMLHttpRequest",
                "X-XSRF-TOKEN": config.xsrf,
                "Cookie": config.cookie,
            }
        )

    def search(self, query: str, start: str, end: str, page: int) -> dict:
        params = {
            "q": query,
            "typeall": 1,
            "suball": 1,
            "timescope": f"custom:{start}-0:{end}-23",
            "page": page,
        }
        response = self.session.get(SEARCH_URL, params=params, timeout=15)
        response.raise_for_status()
        return response.json()


def iter_statuses(payload: dict) -> Iterable[dict]:
    for item in payload.get("data", {}).get("list", []):
        if isinstance(item, dict):
            yield item


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", required=True, help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", required=True, help="End date (YYYY-MM-DD)")
    parser.add_argument(
        "--query",
        action="append",
        default=None,
        help="Search query (repeatable). Defaults to common rider+insurance queries.",
    )
    parser.add_argument("--pages", type=int, default=5, help="Pages per query")
    parser.add_argument(
        "--sleep", type=float, default=1.2, help="Delay seconds between requests"
    )
    parser.add_argument(
        "--out",
        default="weibo_rider_social_insurance.jsonl",
        help="Output JSONL path",
    )
    return parser.parse_args()


def validate_date(value: str) -> str:
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError as exc:
        raise SystemExit(f"Invalid date: {value}") from exc
    return value


def load_config() -> WeiboConfig:
    cookie = os.getenv("WEIBO_COOKIE", "").strip()
    xsrf = os.getenv("WEIBO_XSRF", "").strip()
    if not cookie or not xsrf:
        raise SystemExit(
            "Missing WEIBO_COOKIE or WEIBO_XSRF. "
            "Set them from a logged-in browser session."
        )
    return WeiboConfig(cookie=cookie, xsrf=xsrf)


def main() -> int:
    args = parse_args()
    start = validate_date(args.start)
    end = validate_date(args.end)
    queries = args.query or DEFAULT_QUERIES

    config = load_config()
    scraper = WeiboScraper(config)

    total = 0
    with open(args.out, "w", encoding="utf-8") as handle:
        for query in queries:
            for page in range(1, args.pages + 1):
                try:
                    payload = scraper.search(query, start, end, page)
                except requests.HTTPError as exc:
                    print(
                        f"Request failed for query={query} page={page}: {exc}",
                        file=sys.stderr,
                    )
                    break

                statuses = list(iter_statuses(payload))
                if not statuses:
                    break

                for status in statuses:
                    record = {
                        "query": query,
                        "page": page,
                        "id": status.get("id"),
                        "mid": status.get("mid"),
                        "created_at": status.get("created_at"),
                        "text_raw": status.get("text_raw")
                        or status.get("text"),
                        "user_id": status.get("user", {}).get("id"),
                        "user_screen_name": status.get("user", {}).get(
                            "screen_name"
                        ),
                        "reposts_count": status.get("reposts_count"),
                        "comments_count": status.get("comments_count"),
                        "attitudes_count": status.get("attitudes_count"),
                    }
                    handle.write(json.dumps(record, ensure_ascii=False) + "\n")
                    total += 1

                time.sleep(args.sleep)

    print(f"Saved {total} posts to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
