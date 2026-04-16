const wrapAsync = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default wrapAsync;