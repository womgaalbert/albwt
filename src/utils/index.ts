export function createPageUrl(pageName: string) {
    if (pageName === "Home" || pageName.toLowerCase() === "home") return '/';
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
