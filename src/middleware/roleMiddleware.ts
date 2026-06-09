export const authorizeRole = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user.role) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role))
      return res.status(403).json({
        status: false,
        message: "Forbidden, you are not authorized to access this page!",
      });

    next();
  };
};
