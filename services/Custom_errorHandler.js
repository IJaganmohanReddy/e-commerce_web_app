class Custom_errorHandler extends Error{
    constructor(statusCode,message){
          super()
          this.statusCode= statusCode;
          this.message= message
    }

    static alreadyExists(message){
        return new Custom_errorHandler(409, message);
    }

    static wrong_credentials(message= "username / password is wrong"){
        return new Custom_errorHandler(401, message);
    }

    static unauthorized(message= "unathorized"){
        return new Custom_errorHandler(401, message);
    }

    static notFound(message= "not found"){
        return new Custom_errorHandler(404, message);
    }
}

module.exports= Custom_errorHandler