export class ApiUtils {

    public static removeLevelApiFromPath(path: string): string {

        return path.replace('/api/', '/').toLowerCase();
    }

}