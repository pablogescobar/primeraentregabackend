// customErrors.mjs

class CustomError extends Error {
    constructor(message, name = 'Error', cause, code = 1, otherProblems = 'No listados') {
        super(message);
        this.name = name;
        this.cause = cause;
        this.code = code;
        this.otherProblems = otherProblems;
    }

    static createError({ name = 'Error', cause, message, code = 1, otherProblems = 'No listados' }) {
        return new CustomError(message, name, cause, code, otherProblems);
    }
}

export { CustomError };
