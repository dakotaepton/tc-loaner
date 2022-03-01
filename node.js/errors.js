class ExternalError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class AssetNotFoundError extends ExternalError {
    constructor(assetName, query){
        super(`Asset ${assetName} was not found`);
        this.data = {assetName, query}
    }
}

class UserNotFoundError extends ExternalError {
    constructor(userName, query){
        super(`User ${userName} was not found`);
        this.data = {userName, query}
    }
}

class TicketNotFoundError extends ExternalError {
    constructor(ticketIdentifier, query){
        super(`Ticket ${ticketIdentifier} was not found`);
        this.data = {ticketIdentifier, query}
    }
}

class ServiceError extends ExternalError {
    constructor(httpError, query){
        super(`Service error code: ${httpError}`);
        this.data = {httpError, query};
    }
}

class TokenError extends ExternalError {
    constructor(httpError, query){
        super(`Token does not exist, or is not valid.`);
        this.data = {httpError, query};
    }
}

class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class UserMultipleAssetsError extends InternalError {
    constructor(userName, query){
        super(`User ${userName} is not authorised to have another asset.`);
        this.data = {userName, query};
    }
}

class HeaderError extends InternalError {
    constructor(header, query){
        super(`Header ${header} is missing from the request.`);
        this.data = {header, query};
    }
}

function errorHandler(error){
    // function that parses errors and sends back relevant strings / data to the front end to deal with
    console.log(error);
    switch(true) {
        case error instanceof AssetNotFoundError:
            // 406: Not Acceptable - This response is sent when the web server doesn't find any content that conforms to the criteria given by the user agent.
            // ie - can't find the asset
            return (406, error.message);

        case error instanceof UserNotFoundError:
            // 406: Not Acceptable - This response is sent when the web server doesn't find any content that conforms to the criteria given by the user agent.
            // ie - can't find the user
            return (406, error.message);

        case error instanceof TicketNotFoundError:
            // 406: Not Acceptable - This response is sent when the web server doesn't find any content that conforms to the criteria given by the user agent.
            // ie - can't find the ticket
            return (406, error.message);

        case error instanceof ServiceError:
            // 424: Failed Dependency - The request failed due to failure of a previous request
            // ServiceError is when there's an unknown error with the ticketing service, so we're saying that the dependency on that service has failed.
            return (424, error.message);

        case error instanceof UserMultipleAssetsError:
            // 409: Conflict - This response is sent when a request conflicts with the current state of the server.
            // ie - conflict between expected 0 devices hand having at least 1 device
            return (409, error.message);
        
        case error instanceof TokenError:
            // 401: Unauthorized - Semantically this response means 'unauthenticated'.
            // The client must authenticate itself to get the requested response.
            return (401, error.message);
        
        case error instanceof HeaderError:
            // 412: Precondition Failed - The client has indicated preconditions in its headers which the server does not meet.
            // Basically if there are missing headers

        // Final "else" statement
        default:
            console.log(error);
            console.log(error.name);
            console.log(error.message);
            console.log("I don't know what happened here")
            return (500, error);
    }
}

module.exports = {
    ExternalError, InternalError, AssetNotFoundError, UserNotFoundError, TicketNotFoundError, UserMultipleAssetsError, ServiceError, TokenError, HeaderError, errorHandler
};