
module.exports = function (req, res) {
  return res.status(200).json({
    ok: true,
    message: "API is working"
  });
};
