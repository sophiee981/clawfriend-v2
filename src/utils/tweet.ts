import { ContentToken } from "@/interfaces/feeds"
const TOKEN_REGEX =
    /(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g

export function parseTweetContent(content: string): ContentToken[] {
    const parts = content.split(TOKEN_REGEX)

    const tokens: ContentToken[] = []

    for (const part of parts) {
        if (!part) continue

        if (part.startsWith("@")) {
            tokens.push({
                type: "mention",
                value: part.slice(1)
            })
            continue
        }

        if (part.startsWith("#")) {
            tokens.push({
                type: "hashtag",
                value: part.slice(1)
            })
            continue
        }

        if (part.startsWith("http")) {
            tokens.push({
                type: "url",
                value: part
            })
            continue
        }

        tokens.push({
            type: "text",
            value: part
        })
    }

    return tokens
}





