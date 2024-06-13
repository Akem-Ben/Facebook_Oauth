"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conveyor = void 0;
const conveyor = (next, request, response) => {
    try {
        const user = request.session.user;
        request.user = user;
        next();
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.conveyor = conveyor;
