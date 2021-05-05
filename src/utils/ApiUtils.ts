export class ApiUtils {

    public static validResourcePath(path: string): string {

        return path.replace('/api/', '/').toLowerCase();
    }

}