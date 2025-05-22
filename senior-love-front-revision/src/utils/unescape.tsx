export default function htmlUnescape(str: string): string {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x5C;/g, '\\')
        .replace(/&#96;/g, '`')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}