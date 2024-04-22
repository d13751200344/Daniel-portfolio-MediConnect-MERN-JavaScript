export const home = (_, res) => {
    res.render("pages/home", {
      title: "Home",  //the parameter title will be pass to ejs file
    });
  };