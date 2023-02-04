function errorHandler(err, req, res, next) {
    console.error(err);
    res.send("Error Lmao");
}

export default errorHandler;
