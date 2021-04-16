
export const handler = async (event) => {


    const d = async (callback: any) => {

        let content = "";
        console.log('ueeeeba')

        require("https").get("https://606313a30133350017fd285b.mockapi.io/api/v1/apis", (res: any) => {

            console.log({ res })

            res.setEncoding("utf8");
            res.on("data", (chunk: any) => content += chunk);
            res.on("end", () => {
                callback(content)
            })

        });
    }

    return {
        statusCode: 200,
        body: "",
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };

}




