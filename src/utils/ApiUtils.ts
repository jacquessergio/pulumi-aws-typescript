export class ApiUtils {

    public static buildPath(path: any): string {

        if (path.url_pattern == '/*') {
            throw new Error('Invalid path -> ' + path.url_pattern)
        }

        const pattern: string =  path.url_pattern;

        return '/' + path.api_version + pattern.replace('/api/', '/').toLowerCase();
    }

}