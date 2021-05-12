
function requireUser (req, res, next) {
    if (!req.user) {
      res.status(401);
      throw new Error("You must be logged in to perform this action!");
    }
    next();
}

function requireAdmin (req, res, next) {
  if (!req.user.isAdmin) {
    res.status(403);
    next({message: 'You are not authorized to access this route.'});
  }
  next();
}

module.exports = {requireUser, requireAdmin}
