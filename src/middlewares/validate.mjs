export class Validate {
  static body = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    // Replace body with sanitized/validated data
    req.body = result.data;

    next();
  };

  static query = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.flatten(),
      });
    }

    req.query = result.data;
    next();
  };

  static params = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid route parameters",
        errors: result.error.flatten(),
      });
    }

    req.params = result.data;
    next();
  };

  // For server-rendered view routes — attaches errors, never responds itself
  static bodyForView = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      req.validationErrors = result.error.flatten().fieldErrors;
    } else {
      req.body = result.data;
    }
    next();
  };
}
