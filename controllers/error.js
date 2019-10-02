exports.notFound =(req,res) => {
    res.status(404).render('404',
    {
        pageTitle : 'Sh*t Page not found',
        path : '',
        isAuthenticated : req.session.isLoggedIn
    })
}

exports.serverError =(error,req,res,next) => {
    console.error(error)
    res.status(500).render('500',
    {
        pageTitle : 'An Error Occured, we are fixing it',
        path : '',
        isAuthenticated : req.session.isLoggedIn
    })
}