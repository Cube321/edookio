class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.message = message;
        this.statutCode = statusCode;
    }  
}

module.exports = ExpressError;