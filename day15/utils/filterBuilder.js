const { Op } = require("sequelize");

const buildFilter = (query) => {
  if (!query.filter) {
    console.log("No filter provided, returning null");
    return null;
  }

  const filter = {};
  const filters = Array.isArray(query.filter) ? query.filter : [query.filter];

  filters.forEach((f) => {
    const [field, operator, ...values] = f.split(",");
    let value = values.join(",");

    switch (operator) {
      case "cs":
        filter[field] = { [Op.like]: `%${value}%` };
        break;
      case "sw":
        filter[field] = { [Op.startsWith]: value };
        break;
      case "ew":
        filter[field] = { [Op.endsWith]: value };
        break;
      case "eq":
        filter[field] = value;
        break;
      case "ne":
        filter[field] = { [Op.ne]: value };
        break;
      case "lt":
        filter[field] = { [Op.lt]: Number(value) };
        break;
      case "le":
        filter[field] = { [Op.lte]: Number(value) };
        break;
      case "ge":
        filter[field] = { [Op.gte]: Number(value) };
        break;
      case "gt":
        filter[field] = { [Op.gt]: Number(value) };
        break;
      case "bt":
        const [min, max] = value.split(",");
        filter[field] = { [Op.between]: [Number(min), Number(max)] };
        break;
      case "in":
        filter[field] = { [Op.in]: value.split(",") };
        break;
      case "is":
        filter[field] =
          value.toLowerCase() === "null" ? null : { [Op.not]: null };
        break;
      // Negated operators
      case "ncs":
        filter[field] = { [Op.notLike]: `%${value}%` };
        break;
      case "nsw":
        filter[field] = { [Op.notStartsWith]: value };
        break;
      case "new":
        filter[field] = { [Op.notEndsWith]: value };
        break;
      case "neq":
        filter[field] = { [Op.ne]: value };
        break;
      case "nlt":
        filter[field] = { [Op.gte]: Number(value) };
        break;
      case "nle":
        filter[field] = { [Op.gt]: Number(value) };
        break;
      case "nge":
        filter[field] = { [Op.lt]: Number(value) };
        break;
      case "ngt":
        filter[field] = { [Op.lte]: Number(value) };
        break;
      case "nbt":
        const [nMin, nMax] = value.split(",");
        filter[field] = { [Op.notBetween]: [Number(nMin), Number(nMax)] };
        break;
      case "nin":
        filter[field] = { [Op.notIn]: value.split(",") };
        break;
      default:
        break;
    }
  });

  console.log("Built filter:", JSON.stringify(filter, null, 2));
  return filter;
};

module.exports = buildFilter;
