export const groupShoesByBrandAndLine = (shoes) => {
    if(!shoes || shoes.length < 1) return null;
    return shoes.reduce((acc, shoe) => {
      if (!acc[shoe.ShoeBrand]) {
        acc[shoe.ShoeBrand] = {};
      }
      if (!acc[shoe.ShoeBrand][shoe.ShoeLine]) {
        acc[shoe.ShoeBrand][shoe.ShoeLine] = [];
      }
      acc[shoe.ShoeBrand][shoe.ShoeLine].push(shoe);
      return acc;
    }, {});
  };