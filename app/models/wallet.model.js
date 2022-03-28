module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      token: { type: String },
      network: { type: String },
      blacklist: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Wallet = mongoose.model("wallet", schema);
  return Wallet;
};
