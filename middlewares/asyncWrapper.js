//? وظيفة الملف هادا انه بيمسك كل الerrors اللي بتخصل وبتمرره للnext

module.exports = (asyncFunction) => {
  return (request, response, next) => {
    asyncFunction(request, response, next).catch((error) => {
      next(error);
    });
  };
};
