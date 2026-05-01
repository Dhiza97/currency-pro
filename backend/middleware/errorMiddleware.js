export const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    // Preserve existing status code if already set (e.g., 400), otherwise default to 500
    const statusCode = res.statusCode >= 400 ? res.statusCode : 500

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
    })
}