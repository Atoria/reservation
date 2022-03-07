module.exports = class Responder {
    static answer(code, data, message = '') {

        let response = {
            code: code
        };

        if (data && (data.length || Object.keys(data).length)) {
            response['data'] = data;
        }

        if (message) {
            response['message'] = message;
        }

        return response;
    }
}
