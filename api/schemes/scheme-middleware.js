const Scheme = require("./scheme-model");
const db = require("../../data/db-config");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
// const checkSchemeId = async (req, res, next) => {
//   try {
//     const id = await Scheme.findById(req.params.id);
//     if (!id) {
//       next({
//         status: 404,
//         message: `scheme with scheme_id ${req.params.id} not found`,
//       });
//     } else {
//       next();
//     }
//   } catch (err) {
//     next(err);
//   }
// };

const checkSchemeId = async (req, res, next) => {
  try {
    const existing = await db("schemes").where(
      "scheme_id",
      req.params.scheme_id
    );
    if (!existing) {
      next({
        status: 404,
        message: `scheme with scheme_id ${req.params.scheme_id} not found`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const newScheme = !req.body.scheme_name;
  if (
    newScheme === undefined ||
    !newScheme.trim() ||
    typeof newScheme !== "string"
  ) {
    next({
      status: 400,
      message: "invalid scheme_name",
    });
  } else {
    next();
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (
    instructions === undefined ||
    !instructions.trim() ||
    typeof instructions !== "string" ||
    typeof step_number !== "number" ||
    step_number < 1
  ) {
    next({
      status: 400,
      message: "invalid step",
    });
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
