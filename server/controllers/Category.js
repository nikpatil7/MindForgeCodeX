// const Category = require("../models/Tag");
const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validate data
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //create entry in DB
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);

    return res.status(201).json({ success: true, message: "Category created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while creating the Category",
    });
  }
};

// get all Categories

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res
      .status(200)
      .json({
        success: true,
        data: allCategories,
        message: "All Categories fetched",
      });
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.categoryPageDetails = async (req, res) => {
//   try {
//     const { categoryId } = req.body;

//     // Get courses for the specified category
//     const selectedCategory = await Category.findById(categoryId)
//       .populate("courses")
//       .exec();
//     console.log(selectedCategory);

//     // Handle the case when the category is not found
//     if (!selectedCategory) {
//       console.log("Category not found.");
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     }

//     // Handle the case when there are no courses
//     if (selectedCategory.courses.length === 0) {
//       console.log("No courses found for the selected category.");
//       return res.status(404).json({
//         success: false,
//         message: "No courses found for the selected category.",
//       });
//     }

//     const selectedCourses = selectedCategory.courses;

//     // Get courses for other categories
//     const categoriesExceptSelected = await Category.find({
//       _id: { $ne: categoryId },
//     }).populate("courses");

//     let differentCourses = [];

//     for (const category of categoriesExceptSelected) {
//       differentCourses.push(...category.courses);
//     }

//     // Get top-selling courses across all categories
//     const allCategories = await Category.find().populate("courses");
//     const allCourses = allCategories.flatMap((category) => category.courses);
//     const mostSellingCourses = allCourses
//       .sort((a, b) => b.sold - a.sold)
//       .slice(0, 10);

//     res.status(200).json({
//       selectedCourses: selectedCourses,
//       differentCourses: differentCourses,
//       mostSellingCourses: mostSellingCourses,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}