exports.notFound =(req,res) => {
    res.status(404).render('404',
    {
        pageTitle : 'Sh*t Page not found',
        path : '',
        isAuthenticated : req.session.isLoggedIn
    })
}