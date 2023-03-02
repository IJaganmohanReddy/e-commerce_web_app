class Custom_errorHandler extends Error{
    constructor(statusCode,message){
          this.statusCode= statusCode;
          this.message= message
    }

    static alreadyExists(message){
        return new Custom_errorHandler(409, message);
    }

}

module.exports= Custom_errorHandler